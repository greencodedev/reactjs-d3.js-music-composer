// import * as d3 from '../../d3_';
import { chartUtils } from '../../utils';

import chartRCMan from '../../chartRC/chartRCMan';

declare var d3;

export default (d0) => {
  // let mouseDown = 0;
  // let xDirection = '';
  // let oldPageX = 0;

  d0.chart.append('rect')
    .attr('class', 'chart-rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', d0.data.width)
    .attr('height', d0.data.height)
    .on('mousemove', chartMouseMove)
    .on('mouseout', chartMouseOut)
    .on('mouseup', chartMouseUp)
    // .on('click', chartMouseClick)
    .on('mousedown', chartMouseDown)
    .on('mouseenter', chartMouseEnter)
    .on('mouseleave', chartMouseLeave)

  function chartMouseMove() {
    // if (oldPageX < d3.event.pageX) {
    //     xDirection = 'right';
    // } else if (oldPageX > d3.event.pageX) {
    //     xDirection = 'left';
    // }
    // oldPageX = d3.event.pageX;

    const mouse = d3.mouse(this);
    const clPoint = chartUtils.closestPoint(d0.path.node(), mouse);
    const { newX, newY } = parseXYMouse(clPoint);
    const allXs = d0.data.handles.map(it => it[0]);

    if (window.isSyncPointMode) {
      window.spLines.forEach((line, index) => {
        line
          .attr('x1', mouse[0])
          .attr('x2', mouse[0])
          .attr('opacity', 0.8);
      });

      const toolTipXex = (d0.x(d0.data.maxX) - d0.x(newX)) >= 80 ? 8 : -58;

      d0.handleTooltip
        .attr('x', d => d0.x(newX) + toolTipXex)
        .attr('y', d => d0.y(newY) - 8)
        .attr('class', 'handle-tooltip handle-tooltip--pointer')
        .text(() => `${newX} / ${newY}`);

      return;
    }

    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    // ++ TODO: refactor this
    window.lines.forEach((line, index) => {
      line
        .attr('x1', mouse[0])
        .attr('x2', mouse[0])
        .attr('opacity', 0.5);
    });
    // --

    if (clPoint.distance <= 15 && !allXs.includes(newX)) {
      d0.handlePointer
        .attr('cx', d0.x(newX))
        .attr('cy', d0.y(newY))
        .attr('opacity', 1);

      const toolTipXex = (d0.x(d0.data.maxX) - d0.x(newX)) >= 80 ? 8 : -58;

      d0.handleTooltip
        .attr('x', d => d0.x(newX) + toolTipXex)
        .attr('y', d => d0.y(newY) - 8)
        .attr('class', 'handle-tooltip handle-tooltip--pointer')
        .text(() => `${newX} / ${newY}`);

      window.document.body.style.cursor = 'pointer';
    } else {
      d0.handlePointer.attr('opacity', 0);
      d0.handleTooltip.text('');
      window.document.body.style.cursor = 'default';
    }

    // if (d3.event.ctrlKey) {
    //   // window.document.body.style.cursor = 'move';
    //   // d0.horizontalLine.attr('opacity', 0);

    //   if (d0.data.xDomain && d0.data.xDomain.length && mouseDown) {
    //     // TODO
    //   }
    // } else {
    // }

    d0.horizontalLine
      .attr('y1', mouse[1])
      .attr('y2', mouse[1])
      .attr('opacity', 1)


  }

  function chartMouseOut() {
    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    d0.verticalLine.attr('opacity', 0);
    d0.horizontalLine.attr('opacity', 0);
    d0.handlePointer.attr('opacity', 0);
    d0.handleTooltip.text('');

    window.lines.forEach((line, index) => {
      line
        .attr('opacity', 0);
    });

    window.spLines.forEach((line, index) => {
      line
        .attr('opacity', 0);
    });
  }

  // function chartMouseClick() {
  //   let mouse = d3.mouse(this);
  //   mouse = chartUtils.closestPoint(d0.path.node(), mouse);
  //   const { newX, newY } = parseXYMouse(mouse);

  //   if (+d0.handlePointer.attr('opacity') === 1) {
  //     d0.addHandle([newX, newY]);
  //   }
  // }

  function chartMouseUp() {
    // mouseDown = 0;
    // window.document.body.style.cursor = 'default';
  }

  function chartMouseDown() {
    // mouseDown = 1;

    let mouse = d3.mouse(this);
    mouse = chartUtils.closestPoint(d0.path.node(), mouse);
    const { newX, newY } = parseXYMouse(mouse);

    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    if (window.isSyncPointMode) {
      chartRCMan.addSyncPointLine(mouse);
      // d0.addSyncPointLine(mouse);

      return;
    }

    if (+d0.handlePointer.attr('opacity') === 1) {
      d0.addHandle([newX, newY]);
    }
  }

  function chartMouseEnter() {
    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    d0.xCornerMiddle
      .transition()
      .duration(700)
      .attr('opacity', 1);
  }

  function chartMouseLeave() {
    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    d0.xCornerMiddle
      .transition()
      .duration(700)
      .attr('opacity', 0);
  }

  function parseXYMouse(mouse) {
    mouse[0] = Math.round(mouse[0]);

    let newX = d0.x.invert(mouse[0]);
    let newY = d0.y.invert(mouse[1]);

    newX = Number.isInteger(newX) ? newX : +newX.toFixed(1);
    newY = Math.round(newY);

    return { newX, newY };
  }

  function getSelectedHandlesAndPointers() {
    const selectedHandles = [];
    const selectedPointers = [];

    d0.chart.selectAll('circle')
      .each(function (d, i) {
        const handle = d3.select(this);
        d0.data.handlesSelected.forEach(h => {
          if (h[0] === d[0] && h[1] === d[1]) {
            selectedHandles.push(handle);

            d0.data.handles.forEach(hh => {
              if (hh[0] === d[0] && hh[1] === d[1]) {
                selectedPointers.push(hh);
              }
            });
          }
        });
      });

    return { selectedHandles, selectedPointers }
  }

  d0.getSelectedHandlesAndPointers = getSelectedHandlesAndPointers;
  d0.parseXYMouse = parseXYMouse;
};