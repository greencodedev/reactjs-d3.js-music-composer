declare var d3;

export default (d0) => {
  d0.verticalLine = d0.chart.append('line')
    .attr('class', 'vertical-line')
    .attr('opacity', 0)
    .attr('y1', 0)
    .attr('y2', d0.data.height);

  d0.horizontalLine = d0.chart.append('line')
    .attr('class', 'horizontal-line')
    .attr('opacity', 0)
    .attr('x1', 0)
    .attr('x2', d0.data.width);

  d0.secondLine = d0.chart.append('line')
    .attr('class', 'second-line')
    .attr('transform', 'translate(0, 2)')
    .attr('opacity', 0)
    .attr('y1', 0)
    .attr('y2', d0.data.height - 4);


  // SYNC POINT LINE

  d0.syncPointLine = d0.chart.append('line')
    .attr('class', 'sync-point-line')
    .attr('opacity', 0)
    .attr('y1', 0)
    .attr('y2', d0.data.height);

  function addSyncPointLine(mouse, silence = false) {
    const drag = d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)

    const { newX } = d0.parseXYMouse(mouse);

    const idd = (mouse[0] + '').replace('.', '-');

    d0.chart.append('line')
      .attr('class', 'sync-point-line sync-point-line-' + idd)
      .attr('opacity', 1)
      .attr('x1', mouse[0])
      .attr('x2', mouse[0])
      .attr('y1', 0)
      .attr('y2', d0.data.height);

    d0.chart.append('text')
      .attr('class', 'handle-tooltip')
      .attr('x', mouse[0] + 5)
      .attr('y', 12)
      .attr('class', 'handle-tooltip handle-tooltip--pointer handle-tooltip-sync handle-tooltip-sync-' + idd)
      .text(() => `${newX}`);

    d0.chart.append('circle')
      .attr('class', 'circle circle--sync circle-sync-' + idd)
      .attr('r', 5)
      .attr('cx', mouse[0])
      .attr('cy', 0)
      .call(drag);

    function dragged(d) {
      const handle = d3.select(this);

      let newX = d0.x.invert(d3.event.x);
      newX = Number.isInteger(newX) ? newX : +newX.toFixed(1);

      if (newX < d0.data.minX) {
        newX = d0.data.minX;
      } else if (newX > d0.data.maxX) {
        newX = d0.data.maxX;
      }

      d[0] = newX;

      handle
        .attr('cx', d0.x(d[0]));

      d0.moveSyncPointLine(newX, idd);
    }

    var start;
    var startId;
    function dragstarted(d) {
      var handle = d3.select(this);
      startId = handle.attr('class').replace('circle circle--sync circle-sync-', '');
      start = new Date().getTime();
    }

    function dragended(d) {
      var end = new Date().getTime();

      if ((end - start) < 500) {
        removeSyncPointLine(startId);
      }
    }

    if (!silence && window.syncPoints) {
      window.syncPoints.push([newX, 0]);
    }
  }

  function moveSyncPointLine(newX, idd) {
    const lines = d3.selectAll('.sync-point-line-' + idd);
    const texts = d3.selectAll('.handle-tooltip-sync-' + idd);
    const handles = d3.selectAll('.circle-sync-' + idd);

    lines
      .attr('x1', d0.x(newX))
      .attr('x2', d0.x(newX));

    texts
      .attr('x', d0.x(newX) + 5)
      .text(() => `${newX}`);

    handles
      .attr('cx', d0.x(newX));
  }

  function removeSyncPointLine(idd) {
    d3.selectAll('.sync-point-line-' + idd).remove();
    d3.selectAll('.handle-tooltip-sync-' + idd).remove();
    d3.selectAll('.circle-sync-' + idd).remove();
  }

  d0.addSyncPointLine = addSyncPointLine;
  d0.moveSyncPointLine = moveSyncPointLine;
};