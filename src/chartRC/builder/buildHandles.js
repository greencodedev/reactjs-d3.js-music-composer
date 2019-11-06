// import * as d3 from '../../d3_';
declare var d3;

export default (d0) => {
  let dragLeftX = 0;
  let dragRightX = 0;
  // let dragStartX = 0;
  // let dragStartY = 0;

  const drag = d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)

  d0.chart.selectAll('circle')
    .data([[0, 0]].concat(d0.data.handles))
    .enter()
    .append('circle')
    .attr('class', 'circle circle--simple')
    .attr('r', 5 * d0.data.rZoom)
    // .attr('id', d => `h${d[0]}-${d[1]}`)
    .attr('fml', d => formatFML(d))
    .attr('selected', 'n')
    .attr('cx', d => d0.x(d[0]))
    .attr('cy', d => d0.y(d[1]))
    .call(drag)
    .on('mousemove', handleMouseMove)
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)

  function addHandle(d) {
    d0.chart
      .data([d])
      .append('circle')
      .attr('class', 'circle circle--simple')
      .attr('r', 5 * d0.data.rZoom)
      .attr('id', 'newh')
      .attr('fml', d => 'm')
      .attr('selected', 'n')
      .attr('cx', d => d0.x(d[0]))
      .attr('cy', d => d0.y(d[1]))
      .call(drag)
      .on('mousemove', handleMouseMove)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    d0.data.handles.push(d);
    d0.data.handles.sort((a, b) => a[0] - b[0]);
    d0.path.attr('d', d0.line);

    fillHandleTooltip(d);

    d0.sync();

    let event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    document.getElementById('newh').dispatchEvent(event);
  }

  function fillHandleTooltip(d) {
    const toolTipXex = (d0.data.maxX - d[0]) === 0 ? -50 : 8;

    d0.handleTooltip
      .attr('x', () => d0.x(d[0]) + toolTipXex)
      .attr('y', () => d0.y(d[1]) - 8)
      .attr('class', 'handle-tooltip handle-tooltip--default')
      .text(() => `${d[0]} / ${d[1]}`);
  }

  function formatFML(d) {
    let fml = 'm';

    if (d[0] === d0.data.minX) {
      fml = 'f';
    } else if (d[0] === d0.data.maxX) {
      fml = 'l';
    }

    return fml;
  }

  function dragstarted(d) {
    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    const handle = d3.select(this);
    const fml = handle.attr('fml');
    const selected = handle.attr('selected');

    if (fml === 'm') {
      d0.data.handles.some((handle, index) => {
        if (handle[0] === d[0] && handle[1] === d[1]) {
          const handleLeft = d0.data.handles[index - 1];
          const handleRight = d0.data.handles[index + 1];

          if (handleLeft && handleLeft.length) {
            dragLeftX = handleLeft[0];
          }

          if (handleRight && handleRight.length) {
            dragRightX = handleRight[0];
          }

          return 1;
        }
        return 0;
      });
    }

    if (fml === 'f' || fml === 'l') {
      dragLeftX = 0;
      dragRightX = 0;
    }

    if (d3.event.sourceEvent.ctrlKey) {
      handle
        .attr('class', `circle circle--${selected === 'y' ? 'hover' : 'selected'}`)
        .attr('r', selected === 'y' ? 6.5 * d0.data.rZoom : 5 * d0.data.rZoom)
        .attr('selected', selected === 'y' ? 'n' : 'y');

      if (selected === 'y') {
        d0.data.handlesSelected = d0.data.handlesSelected.filter(h => h[0] !== d[0]);
      } else {
        d0.data.handlesSelected.push(d);
      }

      d0.data.handlesSelected.sort((a, b) => a[0] - b[0]);
    }
  }

  function dragended(d) {
    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    const handle = d3.select(this);

    handle.attr('dr', 0);
    if (handle.attr('id') === 'newh') {
      handle.attr('id', null);
    }

    d0.sync();
  }

  function dragged(d) {
    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    const handle = d3.select(this);
    // handle.attr('dr', 1);

    let newX = d0.x.invert(d3.event.x);
    let newY = d0.y.invert(d3.event.y);

    // console.log('d3.event.y', d0.y(d3.event.y));

    // console.log('d', d);

    if (d3.event.sourceEvent.shiftKey) {
      // const { selectedHandles, selectedPointers } = d0.getSelectedHandlesAndPointers();

      // selectedHandles.forEach((hdl, index) => {
      //   const dr = +hdl.attr('dr');
      //   const drp = selectedPointers[index];

      //   if (dr) {
      //     doDrag(hdl, drp, newX, newY, true);
      //   } else {
      //     const cx = hdl.attr('cx');
      //     const cy = hdl.attr('cy');

      //     let dragPosX = +dragStartX.toFixed(1) - +newX.toFixed(1);
      //     dragPosX = +dragPosX.toFixed(1)
      //     let dragPosY = Math.round(dragStartY) - Math.round(newY);
      //     dragPosY = Math.round(dragPosY);

      //     console.log('dragPosY', dragPosY);

      //     let newXX = d0.x.invert(cx);
      //     newXX += dragPosX;
      //     let newYY = d0.y.invert(cy);
      //     newYY = Math.round(newYY);
      //     console.log(newYY);
      //     newYY -= dragPosY;

      //     // console.log(newXX);
      //     // console.log('in', newYY);

      //     doDrag(hdl, drp, newXX, newYY, false);
      //   }
      // });
    } else {
      // doDrag(handle, d, newX, newY, true);
    }

    // const eve = d3.event;
    // console.log(eve);

    doDrag(handle, d, newX, newY, true);

    // console.log('newY', newY)

    function doDrag(handle, dd, newX, newY, showTooltip) {
      const fml = handle.attr('fml');

      if (fml === 'f') {
        newX = d0.data.minX;
      } else if (fml === 'l') {
        newX = d0.data.maxX;
      }

      if (newX < d0.data.minX) {
        newX = d0.data.minX;
      } else if (newX > d0.data.maxX) {
        newX = d0.data.maxX;
      }

      // console.log('-newY', newY);
      if (newY <= d0.data.minY) {
        newY = d0.data.minY;
      } else if (newY >= d0.data.maxY) {
        newY = d0.data.maxY;
      }

      // console.log('newY', newY, d0.data.minY, d0.data.maxY);

      if (dragLeftX !== 0 && dragLeftX > newX) {
        newX = dragLeftX;
      }

      if (dragRightX !== 0 && dragRightX < newX) {
        newX = dragRightX;
      }

      if (d0.data.xDomain) {
        if (newX < d0.data.xDomain[0]) {
          newX = d0.data.xDomain[0];
        } else if (newX > d0.data.xDomain[1]) {
          newX = d0.data.xDomain[1];
        }
      }

      let yStep = (d0.data.yStep || 0) + '';
      if (yStep.length > 1) {
        yStep = yStep.split('.');
        if (yStep.length > 1) {
          yStep = yStep[1].length;
        }
      } else if (yStep.length === 1) {
        yStep = 0;
      }

      newX = Number.isInteger(newX) ? newX : +newX.toFixed(1);
      newY = Math.abs(newY) > 1 ? +newY.toFixed(yStep) : 0;

      if (newY < d0.data.minY) {
        newY = d0.data.minY;
      }

      dd[0] = newX;
      dd[1] = newY;

      handle
        .attr('cx', d0.x(dd[0]))
        .attr('cy', d0.y(dd[1]));

      if (showTooltip) {
        fillHandleTooltip(dd);
      }

      d0.path.attr('d', d0.line);
    }
  }

  function handleMouseMove() {
    // var mouse = d3.mouse(this);
    // var mousex = mouse[0];
    // var mousey = mouse[1];

    // verticalLine.attr('x1', mousex).attr('x2', mousex).attr('opacity', 1);
    // horizontalLine.attr('y1', mousey).attr('y2', mousey).attr('opacity', 1)
  }

  function handleMouseOver(d, i) {
    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    const handle = d3.select(this);
    const selected = handle.attr('selected');

    handle
      .attr('class', `circle circle--${selected === 'y' ? 'selected-hover' : 'hover'}`)
      .attr('r', selected === 'y' ? 6.5 * d0.data.rZoom : 6.5 * d0.data.rZoom)

    // d0.path
    //   .attr('style', 'stroke-width: 3px');

    fillHandleTooltip(d);

    d0.xCornerMiddle
      .transition()
      .duration(700)
      .attr('opacity', 1);
  }

  function handleMouseOut(d, i) {
    if (window.isZoomModeH || window.isZoomModeV) {
      return;
    }

    const handle = d3.select(this);
    const selected = handle.attr('selected');

    handle
      .attr('class', `circle circle--${selected === 'y' ? 'selected' : 'simple'}`)
      .attr('r', selected === 'y' ? 6.5 * d0.data.rZoom : 5 * d0.data.rZoom)

    d0.handleTooltip.text('');

    d0.verticalLine.attr('opacity', 0);
    d0.horizontalLine.attr('opacity', 0);

    // d0.path
    //   .attr('style', '');
  }

  // function remarkFML() {
  //   let f = false;
  //   let l = false;
  //   d0.chart.selectAll('circle')
  //     .filter(function (d) {
  //       return !!d3.select(this).attr('fml');
  //     })
  //     .each(function (d, i) {
  //       const handle = d3.select(this);
  //       let hX = d0.x.invert(handle.attr('cx'));
  //       hX = Number.isInteger(hX) ? hX : +hX.toFixed(1);

  //       if (hX === d0.data.handles[0][0] && d0.data.minX <= hX && !f) {
  //         handle.attr('fml', 'f');
  //         f = true;
  //       } else if (hX === d0.data.handles[d0.data.handles.length - 1][0] && hX >= d0.data.maxX && !l) {
  //         debugger;
  //         handle.attr('fml', 'l');
  //         l = true;
  //       } else {
  //         handle.attr('fml', 'm');
  //       }
  //     });
  // }

  d0.addHandle = addHandle;
};