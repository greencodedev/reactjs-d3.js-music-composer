export default (d0) => {
  d0.handlePointer = d0.chart
    .data([[0, 0]])
    .append('circle')
    .attr('class', 'circle circle--pointer')
    .attr('r', 6.5 * d0.data.rZoom)
    .attr('id', d => 'hpoint')
    .attr('opacity', 0);
};