// import * as d3 from '../../d3_';

declare var d3;

export default ({ chart, x, y, data }) => {
  chart.append('g')
    .attr('class', 'line-axis line-axis--x')
    .attr('transform', 'translate(0,' + data.height + ')')
    .call(d3.axisBottom(x)
      .ticks(80)
      .tickSize(-data.height)
      .tickFormat(''));

  let yTicks = data.maxY - data.minY;
  yTicks = yTicks > 10 ? 10 : yTicks;

  chart.append('g')
    .attr('class', 'line-axis line-axis--y')
    .call(d3.axisLeft(y)
      .ticks(yTicks)
      .tickSize(-data.width)
      .tickFormat(''));
};