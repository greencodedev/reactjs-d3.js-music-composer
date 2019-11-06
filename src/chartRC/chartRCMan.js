// import * as d3 from '../d3_';

import chartRC from './chartRC';

declare var d3;

const pool = {};

const chartRCMan = {
  build: (data) => {
    const chart = chartRC({
      ...data.settings,
      name: data.name,
      handles: data.points,
      isSecondsAtTop: data.isSecondsAtTop,
      isSecondsAtBottom: data.isSecondsAtBottom,
      syncPoints: data.syncPoints,
    });

    pool[data.name] = chart;

    return chart;
  },

  // TODO: check silence for other actions

  _doRebuild: (key, chart, silence = false) => {
    const svg = d3.select('#chart-svg-' + key);
    svg.selectAll("*").remove();

    const syncEvents = chart.syncEvents;
    chart = chartRC(chart._d);
    chart.syncEvents = syncEvents;

    if (!silence) {
      chart.sync();
    }

    chart.rebuild = () => chartRCMan._doRebuild(key, chart, silence);

    pool[key] = chart;
  },

  rebuildAllCharts: (silence) => {
    for (const key in pool) {
      let chart = pool[key];
      chartRCMan._doRebuild(key, chart, silence);
    }
  },

  rebuildMaxX: (maxX) => {
    for (const key in pool) {
      let chart = pool[key];
      const oldMaxX = chart.data.maxX;

      if (maxX > oldMaxX) {
        chart._d.handles = [].concat(chart.data.handles, [[maxX, chart.data.startY]]);
        chart._d.maxX = maxX;

        chartRCMan._doRebuild(key, chart, false);
      } else if (maxX < oldMaxX) {
        let newHanles = chart.data.handles.filter(handle => handle[0] <= maxX);
        const lastHandle = newHanles[newHanles.length - 1];

        if (newHanles.length >= 1 && lastHandle[0] !== maxX) {
          newHanles = [].concat(newHanles, [[maxX, chart.data.startY]]);
        }

        chart._d.handles = newHanles;
        chart._d.maxX = maxX;

        chartRCMan._doRebuild(key, chart, false);
      }
    }
  },

  rebuildXDomain: (name, xDomain) => {
    function rebuild(key, chart) {
      if (chart) {
        chart._d.xDomain = xDomain;
        chartRCMan._doRebuild(key, chart, false);
      }
    }

    if (name === 'all') {
      for (const key in pool) {
        rebuild(key, pool[key]);
      }
    } else {
      rebuild(name, pool[name]);
    }
  },

  rebuildChartOrder: (chartOrderList) => {
    chartOrderList.forEach((name, index) => {
      const chart = pool[name];
      chart._d.isSecondsAtTop = index === 0;
      chart._d.isSecondsAtBottom = index !== 0 && index === (chartOrderList.length - 1)
    });

    chartRCMan.rebuildAllCharts(true);
  },

  rebuildHeightWithZoom: (name, yZoom) => {
    function rebuild(key, chart) {
      if (chart) {
        chart._d.yZoom = yZoom;
        chartRCMan._doRebuild(key, chart, true);
      }
    }

    if (name === 'all') {
      for (const key in pool) {
        rebuild(key, pool[key]);
      }
    } else {
      rebuild(name, pool[name]);
    }
  },

  addSyncPointLine: (mouse) => {
    for (const key in pool) {
      pool[key].addSyncPointLine(mouse);
    }
  },

  moveSyncPointLine: (newX) => {
    for (const key in pool) {
      pool[key].moveSyncPointLine(newX);
    }
  }
};

export default chartRCMan;