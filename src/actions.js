//  Lim 27.09.2019: 
//  Problem: graph showed initial_Y /start_Y as 50 and not 0 especially in the case of negative ranges (under 0). 
//  Sugested solution: made changes to initial state attributes. minY and startY where changed to -100 and 0. 
//  Tested cases: added another test graph with negative start_Y and other initial_Y value in graph_config.txt file


export const initialState = {
  isNeedReload: false,
  isAudioPlayer: false,
  isVideoPlayer: false,
  isZoom: false,
  isZoomModeV: false,
  isZoomModeH: false,
  isSyncPointMode: false,
  isShowSettings: false,
  isShowLogin: false,
  isShowProjects: false,
  isShowHelpTooltip: true,
  isShowInstruments: false,

  charts: [],
  projects: [],
  instruments: [],

  userName: null,
  color_scheme: 'th0',

  project: {
    favorite: '0',
    datetime_created: '',
    datetime_last_update: '',
    project_name: null,
    number_seconds: 30,
    beats_per_minute: 60,
    beats_per_measure: 4,
    sync_points: [],
    handle_start_count: 2,
    height: 150,
    minX: 0,
    maxX: 30,
    minY: 0,                                // with this value were experemented. It changes all graphs minimal graph range without considering the values of graph_conf.txt; Lim 28.09.2019
    maxY: 100,
    startY: 0,                              // these values where changed; Lim 28.09.2019
    yZoom: 1,
    roboStatus: null,
  }
}

export default {
  set_need_reload: (state) => {
    return {
      isNeedReload: true
    };
  },

  toggle_audio_player: (state, value) => {
    return {
      isAudioPlayer: value,
      isVideoPlayer: false
    };
  },

  toggle_video_player: (state, value) => {
    return {
      isAudioPlayer: false,
      isVideoPlayer: value
    };
  },
  toggle_zoom: (state, value) => {
    return {
      isZoom: value
    };
  },
  toggle_zoom_mode_h: (state, value) => {
    return {
      isZoomModeH: value,
      isZoomModeV: false
    };
  },
  toggle_zoom_mode_v: (state, value) => {
    return {
      isZoomModeH: false,
      isZoomModeV: value
    };
  },
  toggle_sync_point_mode: (state, value) => {
    return {
      isSyncPointMode: value
    };
  },
  toggle_settings: (state) => {
    return {
      isShowSettings: !state.isShowSettings
    };
  },
  toggle_login: (state) => {
    return {
      isShowLogin: !state.isShowLogin
    };
  },
  toggle_projects: (state) => {
    return {
      isShowProjects: !state.isShowProjects
    };
  },
  toggle_help_bubble: (state) => {
    return {
      isShowHelpTooltip: !state.isShowHelpTooltip
    };
  },
  toggle_instruments: (state) => {
    return {
      isShowInstruments: !state.isShowInstruments
    };
  },


  // GENERAL

  data_update: (state, data) => {
    return {
      ...data,
      project: {
        ...state.project,
        ...data.project,
      }
    };
  },

  // PROJECT

  project_update: (state, value) => {
    return {
      project: value,
      // project_name: data.project_name || state.project_name,
      // number_seconds: +(data.number_seconds || state.number_seconds),
      // beats_per_minute: +(data.beats_per_minute || state.beats_per_minute),
      // beats_per_measure: +(data.beats_per_measure || state.beats_per_measure),

      // isShowHelpTooltip: data.isShowHelpTooltip || state.isShowHelpTooltip,
      // roboStatus: data.roboStatus || state.roboStatus,
    };
  },

  // CHARTS

  charts_update: (state, charts) => {
    return {
      charts: [...charts]
    };
  },
  charts_update_points: (state, charts) => {
    const newCharts = state.charts.map(chart => {
      const newChart = charts.find(ch => ch.name === chart.name);
      return {
        ...chart,
        settings: {
          ...chart.settings,
          xZoom: (newChart || chart).settings.xZoom
        },
        points: (newChart || chart).points,
      };
    });

    return {
      charts: [...newCharts],
    }
  },
  charts_reorder: (state, charts) => {
    const newCharts = [...charts.map((chart, index) => {
      return {
        ...chart,
        sortOrder: index + 1
      };
    })];

    return {
      charts: [...newCharts],
    }
  },

  instruments_update: (state, instruments) => {
    return {
      instruments: [...instruments]
    };
  },
};