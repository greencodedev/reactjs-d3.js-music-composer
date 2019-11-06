/**
 * For fetching data from server.
 */
import Papa from 'papaparse';

import { chartUtils, sleep, getAidFromURL } from './utils';

declare var d3;

export default class API {
  /**
   * Load the projects from server using cgi
   * @input: []
   * @output: object(project data)
  */
  static loadProject = async (defaultData) => {
    const { pid, did, uid } = await getIDs();

    const now = Date.now();
    const domain = document.location.origin;
    const graphData = Papa.parse(await (await fetch(`${domain}/txt/graph_config.txt?i=` + now)).text(), {
      delimiter: '|',
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    }).data.map(g => {
      return {
        name: g.OBJECT,
        label: g.LABEL,
        sortOrder: g.SORT_ORDER,
        settings: {
          connType: g.CONNECTION_TYPE,
          minY: g.Y_MIN,
          maxY: g.Y_MAX,
          startY: g.Y_INITIAL,
          yStep: g.Y_STEP_SIZE_MIN,
          ySymbol: g.Y_SCALE_SYMBOL,

          // REFACTOR THIS
          height: 150,
          handle_start_count: 2,
          beats_per_minute: 60,
          beats_per_measure: 4,
          minX: 0,
          maxX: 30,
          yZoom: 1,
        }
      };
    }).sort((a, b) => a.sortOrder - b.sortOrder);

    const sessionData = await ffetch('/cgi-bin/get_project_data.pl', { pid, did, uid });
    Object.keys(sessionData).forEach(k => {
      if (sessionData[k] && sessionData[k].includes('|') && k !== 'sync_points')
        sessionData[k] = sessionData[k].split('|').map(v => v.split(',').map(vv => +vv));
    });

    if (sessionData['sync_points']) {
      sessionData['sync_points'] = sessionData['sync_points'].split('|').map(it => +it);
    }

    if (sessionData['instruments']) {
      sessionData['instruments'] = sessionData['instruments'].split(',');
    } else {
      sessionData['instruments'] = [];
    }

    const charts = chartUtils.buildChartsFromData(graphData, defaultData, sessionData);
    const project = {
      project_name: sessionData['project_name'],
      sync_points: sessionData['sync_points'] || [],
      number_seconds: sessionData['number_seconds'] || defaultData['number_seconds'],
      beats_per_measure: sessionData['beats_per_measure'] || defaultData['beats_per_measure'],
      beats_per_minute: sessionData['beats_per_minute'] || defaultData['beats_per_minute'],
      favorite: sessionData['favorite'] || false,
      datetime_created: sessionData['datetime_created'],
      datetime_last_update: sessionData['datetime_last_update'],
    };

    let projects = [];
    let userName = null;

    const res = await ffetch('/cgi-bin/get_project_list.pl', { did, uid });
    if (res && res['result'] === 'ok') {
      projects = res['projects'];
    }

    if (uid) {
      const res2 = await ffetch('/cgi-bin/get_user_info.pl', { uid: uid });
      if (res2 && res2['result'] === 'ok') {
        userName = res2['user_name'];
      }
    }

    // instruments
    const instruments = Papa.parse(await (await fetch(`${domain}/txt/instruments_config.txt?i=` + now)).text(), {
      delimiter: '|',
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    }).data.map(g => {
      return {
        object_id: g.object_id,
        object_name: g.object_name,
        category_id: g.category_id,
        // category_name: g.category_name,
        // size: g.size,
        // sort_order: g.default_sort_order,
        checked: sessionData['instruments'].includes(g.object_id),
      };
    });
    // .sort((a, b) => a.sort_order - b.sort_order)

    return { charts, project, projects, userName, instruments: instruments || [] };
  }
  /**
   * Save the projects
   * @input: chart value, project detail info, instruments kind
   */
  static saveProject = async (charts, project, instruments, startRobo, fn_project_update = () => { }) => {
    const { pid, did, uid } = await getIDs();

    const data = { ...project };
    charts.forEach(chart => {
      data[chart.name] = chart.points.join('|');
    });

    data.compose = startRobo ? '1' : '0';
    data.pid = pid;
    data.did = did;
    data.uid = uid;
    data.video_filename = window.__rc_video_filename;


    // TODO refactor this
    delete data['handle_start_count'];
    delete data['isShowHelpTooltip'];
    delete data['maxX'];
    delete data['maxY'];
    delete data['minX'];
    delete data['minY'];
    delete data['startY'];
    delete data['yZoom'];
    delete data['height'];
    delete data['roboStatus'];

    let sync_points = new Set();
    d3.selectAll('.handle-tooltip-sync').each(function (d, i) {
      sync_points.add(d3.select(this).text());
    });
    sync_points = Array.from(sync_points).join('|');
    data['sync_points'] = sync_points;


    data['instruments'] = instruments.filter(it => it.checked).map(it => it.object_id).join(',');

    await ffetch('/cgi-bin/save_project_data.pl', data);

    if (data.compose === '1') {
      project.roboStatus = 'ANALYZING';
      fn_project_update(project);

      await sleep(5 * 1000)

      let count = 300;
      while (count) {
        await sleep(2 * 1000)

        let roboStatusResp = (await ffetch('/cgi-bin/get_work_status.pl', { pid, did, uid }))['status'];
        if (roboStatusResp) {
          project.roboStatus = roboStatusResp;
          fn_project_update(project);
        }

        count -= 1;
      }
    }
  }

  static removeProject = async (pid) => {
    const { did, uid } = await getIDs();

    await ffetch('/cgi-bin/delete_project.pl', { did, pid, uid });
  }

  static createNewProject = async (project_name) => {
    const { did, uid } = await getIDs();
    const pid = (await ffetch('/cgi-bin/get_project_id.pl'))['pid'];

    if (pid) {
      await ffetch('/cgi-bin/save_project_data.pl', {
        project_name, pid, did,
        number_seconds: 30,
        beats_per_minute: 60,
        beats_per_measure: 4,
      });
    }

    const res = await ffetch('/cgi-bin/get_project_list.pl', { did: did, uid: uid });
    return res['projects'];
  }
  /**
   * To autorizate users.
   */
  static sendAuthorizationEmail = async (email, name, lang = 'en') => {
    const { pid, did } = await getIDs();

    await ffetch('/cgi-bin/send_authorization_email.pl', {
      pid: pid, did: did,
      email_address: email, user_name: name,
      language_preference: lang
    });
  }

  static authorizeUser = async (aid, did) => {
    return await ffetch('/cgi-bin/authorize_user.pl', {
      aid: aid, did: did,
    });
  }
  /**
   * To detect the whether it needs Reload or not based on time. after 900ms, it automatically update version.
   */
  static needReload = async () => {
    const lastVersionTime = localStorage.getItem('lastVersionTime');
    const now = Date.now() / 1000;

    if (!lastVersionTime) {
      localStorage.setItem('lastVersionTime', now);
      return false;
    }

    if (lastVersionTime - now > 900) {
      localStorage.setItem('lastVersionTime', now);

      const response = await fetch('/VERSION.js?i=' + now);
      if (response) {
        let version = await response.text();
        if (version) {
          version = version.split('=')[1];
          version = +version.replace('"', '').trim();
          return window.__VERSION__ !== version;
        }
      }
    }

    return false;
  }
}


/**
 * Get User ID, device id, project id
 */
const getIDs = async () => {
  let did = localStorage.getItem('did');
  if (!did) {
    did = (await ffetch('/cgi-bin/get_device_id.pl'))['did'];
    if (did) localStorage.setItem('did', did);
  }

  let pid = localStorage.getItem('pid');
  if (!pid) {
    pid = (await ffetch('/cgi-bin/get_project_id.pl', { did }))['pid']
    if (pid) localStorage.setItem('pid', pid);
  }

  let uid = localStorage.getItem('uid');
  if (!uid) {
    const aidUrl = getAidFromURL();
    if (aidUrl) {
      const res = await API.authorizeUser(aidUrl, did);
      if (res && res['result'] === 'ok' && res['uid']) {
        uid = res['uid'];
        localStorage.setItem('uid', res['uid']);
      }
    }
  }

  return { pid, did, uid };
}

/**
 * basic function for all api function
 * Send Json data to server and then Get Json data from server asynchronously
 */

const ffetch = async (url, data = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}