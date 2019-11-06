import {
  buildRootChart,
  buildXYCornerAxis,
  buildXYLabels,
  buildXYAxis,
  buildMainLinePath,
  buildXYLines,
  buildChartRect,
  buildHandles,
  buildHandleTooltip,
  buildHandlePointer
} from './builder';

import { winUtils } from '../utils';

declare var d3;

export default (_d) => {
  const d0 = { _d };
  const isScroll = winUtils.hasClientScroll();
  const margin = {
    top: 20,
    right: 0,
    bottom: 5,
    left: 0
  };

  if (_d.isSecondsAtBottom && _d.yZoom <= 0.6) {
    margin.bottom = -5;
  } else if (!_d.isSecondsAtBottom && !_d.isSecondsAtTop) {
  }

  const innerWidth = window.innerWidth > 1200 ? window.innerWidth : 1200;
  const width = innerWidth - 150 - margin.left - margin.right - (isScroll ? 20 : 0);
  let height = (_d.height * _d.yZoom) - margin.top - margin.bottom - 8 + (_d.isSecondsAtBottom ? -10 : +12) -
    (_d.isSecondsAtTop ? 12 : 0);

  let rZoom = _d.yZoom;
  if (rZoom > 1) {
    rZoom = 1;
  }

  d0.data = {
    name: _d.name,
    handles: _d.handles,
    handlesSelected: [],
    axis: {
      x: d3.range(_d.minX, _d.maxX + 1).map(n => n),
      y: d3.range(_d.minY === 0 ? 0 : _d.minY / 10, _d.maxY / 10 + 1).map(n => n * 10)
    },

    minX: _d.minX,
    maxX: _d.maxX,
    minY: _d.minY,
    maxY: _d.maxY,
    startY: _d.startY,
    handle_start_count: _d.handle_start_count,
    height: height,
    width: width,
    margin: margin,
    isSecondsAtTop: _d.isSecondsAtTop,
    isSecondsAtBottom: _d.isSecondsAtBottom,
    xDomain: _d.xDomain || [_d.minX, _d.maxX],
    yDomain: _d.yDomain || [_d.minY, _d.maxY],
    yZoom: _d.yZoom,
    rZoom: rZoom,
    ySymbol: _d.ySymbol,
    yStep: _d.yStep
  };

  d0.x = d3.scaleLinear().rangeRound([0, width]);
  d0.y = d3.scaleLinear().rangeRound([height, 0]);

  d0.line = d3.line()
    .x(function (d) {
      return d0.x(d[0]);
    })
    .y(function (d) { return d0.y(d[1]); })
    .curve(_d.connType === 1 ? d3.curveLinear : d3.curveStepAfter);

  d0.svg = d3.select('#chart-svg-' + _d.name);

  d0.chart = buildRootChart(d0);

  d0.x.domain(d0.data.xDomain);
  d0.y.domain(d0.data.yDomain);


  buildXYAxis(d0);
  buildXYCornerAxis(d0);
  buildXYLabels(d0);

  buildMainLinePath(d0);

  buildXYLines(d0);

  buildHandleTooltip(d0);
  buildHandlePointer(d0);

  buildChartRect(d0);
  buildHandles(d0);

  d0.syncEvents = d0.syncEvents || [];
  d0.sync = () => {
    d0.syncEvents.forEach(evt => evt(d0));
  };
  d0.onSync = (callback) => {
    d0.syncEvents.push(callback);
  };

  if (!window.lines) {
    window.lines = [];
  }
  window.lines.push(d0.verticalLine);

  if (!window.spLines) {
    window.spLines = [];
  }
  window.spLines.push(d0.syncPointLine);

  if (!window.slines) {
    window.slines = [];
  }
  window.slines.push(d0.secondLine);

  if (!window.syncPoints) {
    window.syncPoints = [];
  }

  if (window.syncPoints.length > 0) {
    window.syncPoints.forEach(p => {
      d0.addSyncPointLine([d0.x(p[0]), 0], true);
    });
  }

  if (_d.syncPoints) {
    _d.syncPoints.forEach(p => {
      d0.addSyncPointLine([d0.x(p), 0], true);
    });
  }



  // sync_points = Array.from(sync_points).join('|');

  // window.slines.forEach((line, index) => {
  //   line
  //     .attr('x1', d0.x(10))
  //     .attr('x2', d0.x(10))
  //     .attr('opacity', 1);
  // });

  window['d0'] = { x: d0.x };

  return d0;
};