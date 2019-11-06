export default ({ chart, data }) => {
  let pX = -2;
  let pY = -16;

  if ((data.isSecondsAtTop || data.isSecondsAtBottom)) {
    let hS = data.height + data.margin.top + 8;
    if (data.isSecondsAtTop) {
      hS = -20;
      pY = -29;
      pX = -12;
    }

    chart.append('text')
      .attr('class', 'x-label')
      .attr('transform', 'translate(' + (data.width - 19) + ' ,' + hS + ')')
      .text('Seconds');
  }

  if (!data.isSecondsAtTop && !data.isSecondsAtBottom) {
    pX = -12;
    pY = -20;
  }

  chart.append('text')
    .attr('class', 'y-label')
    .attr('y', pY)
    .attr('x', pX)
    .attr('dy', '1em')
    .text(data.ySymbol);
};