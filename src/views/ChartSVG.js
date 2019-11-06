import React, { Component } from 'react';

import chartRCMan from '../chartRC/chartRCMan';

declare var d3;

let xZoom = [];
let _xZoom = [];
let x0 = 0;
let leftRectZoom = null;
let rightRectZoom = null;

export default class ChartSVG extends Component {
  chartRC = null;
  elRef = null;

  y0 = 0;
  yZoom = [];
  el = null;
  el2 = null;
  el3 = null;

  // let xZoom = [].concat(_xZoom || []);

  constructor(props) {
    super(props);

    this.elRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.isZoomModeH || nextProps.isZoomModeV) {
      this.elRef.current.addEventListener('mousedown', this.zoomMouseDown, false);
      this.elRef.current.addEventListener('mouseup', this.zoomMouseUp, false);
      this.elRef.current.addEventListener('mousemove', this.zoomMouseMove, false);
      this.elRef.current.addEventListener('mouseenter', this.zoomMouseEnter, false);
      this.elRef.current.addEventListener('mouseleave', this.zoomMouseLeave, false);
    } else {
      this.elRef.current.removeEventListener('mousedown', this.zoomMouseDown, false);
      this.elRef.current.removeEventListener('mouseup', this.zoomMouseUp, false);
      this.elRef.current.removeEventListener('mousemove', this.zoomMouseMove, false);
      this.elRef.current.removeEventListener('mouseenter', this.zoomMouseEnter, false);
      this.elRef.current.removeEventListener('mouseleave', this.zoomMouseLeave, false);
    }

    // if (nextProps.isSyncPointMode) {
    //   this.elRef.current.addEventListener('mousemove', this.syncPointMouseMove, false);
    // } else {
    //   this.elRef.current.removeEventListener('mousemove', this.syncPointMouseMove, false);
    // }

    window.isZoomModeH = nextProps.isZoomModeH;
    window.isZoomModeV = nextProps.isZoomModeV;
    window.isSyncPointMode = nextProps.isSyncPointMode;

    return false;
  }

  componentDidMount() {
    const { data, syncPoints } = this.props;

    this.chartRC = chartRCMan.build({
      ...data,
      syncPoints,
    });

    this.chartRC.onSync((d0) => {
      const { data: { handles, xDomain } } = d0;

      this.props.updatePoints([{
        name: data.name,
        points: handles,
        settings: { xZoom: xDomain }
      }]);
    });

    leftRectZoom = d3.select('#leftRectZoom');
    rightRectZoom = d3.select('#rightRectZoom');

    xZoom = this.props.data.settings.xZoom;
    _xZoom = [].concat(this.props.data.settings.xZoom);
    this.yZoom = this.props.data.settings.yZoom;

    const { name } = this.props.data;
    this.el = document.getElementById(`chart-grid-${name}`);
    this.el2 = document.getElementById(`chart-title-${name}`);
    this.el3 = document.getElementById(`chart-grid-title-label-${name}`);
  }

  // syncPointMouseMove = (event) => {
  //   console.log(event);
  // }

  zoomMouseDown = (event) => {
    window.isMouseDown = true;
    window.isMouseDownFor = this.props.data.name;

    x0 = event.pageX;
    this.y0 = event.pageY;
  };

  zoomMouseUp = (event) => {
    window.isMouseDown = false;

    leftRectZoom.attr('opacity', 0);
    rightRectZoom.attr('opacity', 0);

    window.leftRectZoom = 0;
    window.rightRectZoom = 0;

    chartRCMan.rebuildXDomain('all', xZoom);

    // const el0 = document.getElementById(`leftRectZoom-${this.props.data.name}`);
    // let elHeight = el0.height.baseVal.value + 40;
    // this.el.style.height = elHeight + 'px';
    // this.el2.style.height = elHeight + 'px';
    // this.el3.style.height = elHeight + 'px';
  };

  zoomMouseEnter = (event) => {
    if (window.isZoomModeV) {
      document.body.style.cursor = 'ns-resize';
    } else {
      document.body.style.cursor = 'ew-resize';
    }
  }

  zoomMouseLeave = (event) => {
    document.body.style.cursor = 'default';
  }


  zoomMouseMove = (event) => {
    if (window.isMouseDownFor !== this.props.data.name) {
      return;
    }

    if (window.isMouseDown) {
      if (window.isZoomModeV) {
        this.zoomVertical(event);
      } else {
        this.zoomHorizontal(event);
      }
    }
  };

  zoomVertical = (event) => {
    let range = event.pageY - this.y0;

    if (range >= 10) {
      this.yZoom += 0.1;
      this.y0 = event.pageY;
    } else if (range <= -10) {
      this.yZoom -= 0.1;
      this.y0 = event.pageY;
    }

    if (this.yZoom <= 0.7) {
      this.yZoom = 0.7;
      return;
    }

    if (this.yZoom >= 2.6) {
      this.yZoom = 2.5;
      return;
    }

    const { name } = this.props.data;

    chartRCMan.rebuildHeightWithZoom(name, this.yZoom);

    if (this.el && this.el2 && this.el3) {
      let pHeight = +this.el.style.height.replace('px', '');

      if (range >= 10) {
        pHeight += 15;
      } else if (range <= -10) {
        pHeight -= 15;
      }

      this.el.style.height = pHeight + 'px';
      this.el2.style.height = pHeight + 'px';
      this.el3.style.height = pHeight + 'px';
    }
  }

  zoomHorizontal = (event) => {
    let range = event.pageX - x0;
    let xD = event.pageX < window.innerWidth / 2 ? 0 : 1;

    if (xD === 1) {
      window.leftRectZoom = 0;
      window.rightRectZoom = 0.1;

      leftRectZoom.attr('opacity', 0);
      rightRectZoom.attr('opacity', 0.1);
    } else {
      window.leftRectZoom = 0.1;
      window.rightRectZoom = 0;

      leftRectZoom.attr('opacity', 0.1);
      rightRectZoom.attr('opacity', 0);
    }

    if (range > 0) {
      document.body.style.cursor = 'e-resize';
    } else {
      document.body.style.cursor = 'w-resize';
    }

    if (range >= 15) {
      xZoom[xD] = xZoom[xD] - 1;
    } else if (range <= -15) {
      xZoom[xD] = xZoom[xD] + 1;
    }

    if (xZoom[0] < 0) {
      xZoom[0] = 0;
      return;
    }

    if (xZoom[1] > _xZoom[1]) {
      xZoom[1] = _xZoom[1];
    }

    chartRCMan.rebuildXDomain('all', xZoom);
    x0 = event.pageX;
  }

  render() {
    const { name } = this.props.data;

    return (
      <div ref={this.elRef} className='chart-svg'>
        <svg id={`chart-svg-${name}`}></svg>
      </div>
    );
  }
}