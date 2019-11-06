// import * as d3 from '../../d3_';

declare var d3;

export default (d0) => {
  const isMiddle = !d0.data.isSecondsAtTop && !d0.data.isSecondsAtBottom;
  const xTickCount = d0.data.xDomain[1] > 100 ? ((d0.data.xDomain[1] / 10) + 40) : d0.data.xDomain[1];

  const xCorner = d0.chart.append('g')
    .attr('class', 'corner-axis corner-axis--x' + (isMiddle ? ' corner-axis--x-middle' : ''))
    .attr('opacity', (isMiddle ? 0 : 1))
    .attr('transform', 'translate(0,' + (d0.data.isSecondsAtTop || isMiddle ? 0 : d0.data.height) + ')')
    .call(d3[d0.data.isSecondsAtTop || isMiddle ? 'axisTop' : 'axisBottom'](d0.x)
      .ticks(xTickCount)
      .tickFormat((t, i) => {
        t = (
          t === d0.data.xDomain[0] ||
          t === d0.data.xDomain[1] ||
          (i % 2 === 0 && d0.data.xDomain[1] > 60) ||
          (i && d0.data.xDomain[1] <= 60)
        ) ? t : '';
        return t;
      }));

  const xCornerMiddle = xCorner
    .filter('.corner-axis--x-middle');

  xCornerMiddle
    .selectAll('text')
    .attr('transform', d => d !== d0.data.maxX ? 'translate(0, 3)' : 'translate(-5, 3)');


  let yTickCount = 6;
  if (d0.data.yZoom >= 1.6) {
    yTickCount = 10;
  } else if (d0.data.yZoom <= 0.6) {
    yTickCount = 3;
  }

  if ((d0.data.maxY - d0.data.minY) < yTickCount) {
    yTickCount = d0.data.maxY - d0.data.minY;
  }

  d0.chart.append('g')
    .attr('class', 'corner-axis corner-axis--y')
    // .call(d3.axisLeft(d0.y).tickValues(range));
    .call(d3.axisLeft(d0.y).ticks(yTickCount));



  d0.xCornerMiddle = xCornerMiddle;
};