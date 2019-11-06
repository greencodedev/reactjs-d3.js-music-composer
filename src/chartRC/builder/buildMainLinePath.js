export default (d0) => {
  d0.chart.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", d0.data.width)
    .attr('transform', 'translate(0,-15)')
    .attr("height", d0.data.height + 30);

  d0.chart.append("rect")
    .attr("id", "leftRectZoom-" + d0.data.name)
    .attr("width", d0.data.width / 2)
    .attr('transform', 'translate(0,0)')
    .attr('opacity', window.leftRectZoom || 0)
    .attr("height", d0.data.height);

  d0.chart.append("rect")
    .attr("id", "rightRectZoom")
    .attr("width", d0.data.width / 2)
    .attr('transform', 'translate(' + (d0.data.width / 2) + ',0)')
    .attr('opacity', window.rightRectZoom || 0)
    .attr("height", d0.data.height)

  d0.path = d0.chart.append('path')
    .attr('clip-path', () => {
      if (window.isMouseDown && window.isZoomModeV) {
        return null;
      } else {
        return 'url(#clip)';
      }
    })
    .datum(d0.data.handles)
    .attr('class', 'line-path')
    .attr('d', d0.line);
};