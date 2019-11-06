export default ({ svg, data }) => {
  let h = 15;

  if (data.isSecondsAtTop) {
    h = 30;
  }

  if (!data.isSecondsAtTop && !data.isSecondsAtTop) {
    h = 18;
  }

  if (data.yZoom < 0.7) {
    h = 20;

    if (!data.isSecondsAtTop) {
      h = 15;
    }
  }

  svg.append('rect')
    .attr('class', 'root-chart root-chart--rect')
    .attr('width', data.width + 300)
    .attr('height', data.height)

  return svg.append('g')
    .attr('class', 'root-chart root-chart--g')
    .attr('transform', 'translate(30,' + h + ')')
    .attr('width', data.width + 300)
};