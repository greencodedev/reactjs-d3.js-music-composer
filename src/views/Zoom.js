/**
 *@ParentComponent: Home
 *@ChildComponent: chartRCMan, ZoomPanel
 *@Props:data
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import i18next from 'i18next';

import { Card, Icon, RangeSlider, Menu, MenuItem } from "@blueprintjs/core";

import chartRCMan from '../chartRC/chartRCMan';

export default React.memo(({ data, actions }) => {
  return (
    <Card className='instruments'>
      <div className="columns is-gapless" style={{ marginBottom: 2 }}>
        {/* <div className="column is-narrow">
          <ControlGroup className='instruments-header'>
            <Label className='instruments-title'>Instruments</Label>
            <Icon className='instruments-title-btn' icon="cross" onClick={() => rootHook.toggleZoom(false)} />
          </ControlGroup>
        </div> */}
        <div className="column">
          <div className={`instrument zoom`}>
            <div className='title'>
              <div className='title-label'>{i18next.t('label.zoom_in_zoom')}</div>
              <Icon className='title-btn' icon="small-cross" onClick={() => actions.toggle_zoom(false)} />
            </div>
            <ZoomPanel charts={data} />
          </div>
        </div>
      </div>
    </Card>
  );
});

class ZoomPanel extends Component {
  state = {
    xZoom: this.props.xZoom,
    yZoom: this.props.yZoom0,
    yZoomAll: false,
    selectedChart: this.props.selectedChart0,
  }

  handleXZoomChange = (value) => {
    this.setState({ xZoom: value });
  }

  handleXZoomRelease = (value) => {
    chartRCMan.rebuildXDomain('all', value, true);
  }

  handleXZoomReset = () => {
    this.setState({
      xZoom: this.props.xZoom0
    }, () => {
      chartRCMan.rebuildXDomain('all', this.state.xZoom0);
    })
  }

  handleYZoomChange = (value) => {
    this.setState({ yZoom: +value / 100 });
  }

  handleYZoomRelease = (value) => {
    value = +value / 100;

    let charts = this.props.charts;
    let selectedChartName = this.state.selectedChart;

    if (!selectedChartName) {
      selectedChartName = this.props.selectedChart0;
    }

    if (this.state.yZoomAll) {
      selectedChartName = 'all';
    }

    if (charts && charts.length) {
      charts = charts.map(chart => {
        let newYZoom = chart.settings.yZoom;
        if (selectedChartName === 'all' || selectedChartName === chart.name) {
          newYZoom = value;
        }

        return {
          ...chart,
          settings: {
            ...chart.settings,
            yZoom: newYZoom,
          },
          selected: this.state.selectedChart === chart.name
        }
      });

      this.props.updateCharts(charts);
      chartRCMan.rebuildHeightWithZoom(selectedChartName, value);
    }
  }

  handleApplyYZoomAll = (status) => {
    this.setState({
      yZoomAll: status
    }, () => {
      if (this.state.yZoomAll) {
        this.handleYZoomRelease(this.state.yZoom * 100);
      }
    });
  }

  handleXZoomMove = (xZoom, xDirection, step = 1) => {
    const xZoom0 = this.props.xZoom0;

    const delim = xDirection === 'left' ? -step : +step;
    let xZoomLeftX = +(xZoom[0] + delim).toFixed(1);
    let ZoomRightX = +(xZoom[1] + delim).toFixed(1);

    if (xZoomLeftX < xZoom0[0]) {
      xZoomLeftX = xZoom0[0];
    } else if (ZoomRightX > xZoom0[1]) {
      ZoomRightX = xZoom0[1];
    } else {
      xZoom[0] = xZoomLeftX;
      xZoom[1] = ZoomRightX;
    }

    chartRCMan.rebuildXDomain('all', xZoom);
    this.setState({ xZoom: [].concat(xZoom) });
  }

  handleMenuSelect = (chart) => {
    let name = 'all';

    if (chart) {
      name = chart.name;
    }

    this.setState({
      selectedChart: name,
      yZoom: chart.settings.yZoom,
      yZoomAll: false
    })
  }

  renderChartListMenu = () => {
    if (!this.props.charts.length) {
      return null;
    }

    return (
      <Menu>
        {this.props.charts.map(chart => (
          <MenuItem
            key={chart.name}
            active={!this.state.yZoomAll && chart.name === this.state.selectedChart}
            text={chart.label}
            onClick={() => this.handleMenuSelect(chart)} />
        ))}
        <Menu.Divider />
        <MenuItem
          active={this.state.yZoomAll}
          text={'All graphs'}
          onClick={() => this.handleApplyYZoomAll(true)} />
      </Menu>
    );
  }

  render() {
    const { charts } = this.props;
    let { xZoom, yZoom, yZoomAll, selectedChart } = this.state;

    let xZoom0 = null;
    // let yZoom0 = null;
    let selectedChart0 = null;

    if (charts.length) {
      const ch = charts.find(chart => chart.selected) || charts[0];
      selectedChart0 = ch.name;

      if (ch && ch.points && ch.points.length) {
        xZoom0 = [ch.points[0][0], ch.points[ch.points.length - 1][0]];
      }

      // yZoom0 = ch.settings.yZoom;
    }


    if (!charts.length || !xZoom0 || !xZoom0.length) {
      return null;
    }

    let labelStepSize = 20;
    if (xZoom0[1] <= 30) {
      labelStepSize = 1;
    } else if (xZoom0[1] <= 60) {
      labelStepSize = 5;
    }

    let stepSize = 5;
    if (xZoom0[1] <= 30) {
      stepSize = 1;
    } else if (xZoom0[1] <= 60) {
      stepSize = 2;
    }

    // const selectedChartLabel = 'All graphs'

    const ch = charts.find(chart => chart.name === (selectedChart || selectedChart0));
    if (!yZoomAll && ch && (selectedChart || selectedChart0)) {
      // selectedChartLabel = ch.label;
    }

    if (!yZoom && ch) {
      yZoom = (+ch.settings.yZoom).toFixed(1);
    }

    if (!xZoom) {
      if (ch) {
        xZoom = ch.settings.xZoom;
      } else {
        xZoom = xZoom0;
      }
    }

    const isMoveDisabledLeft = xZoom0[0] === xZoom[0];
    const isMoveDisabledRight = xZoom0[1] === xZoom[1];

    yZoom = Math.round(+yZoom * 100);
    return (
      <div className='zoom-content'>
        {/* <div className='x-zoom'> */}
        <div className='x-zoom-1'>
          <div className='x-zoom-title'>{i18next.t('label.zoom_in_x_axis_zoom')}</div>
          <RangeSlider
            className='x-zoom-slider'
            min={xZoom0[0]}
            max={xZoom0[1]}
            stepSize={stepSize}
            labelStepSize={labelStepSize}
            onChange={this.handleXZoomChange}
            onRelease={this.handleXZoomRelease}
            value={xZoom}
          />
          <Icon className={classNames('x-zoom-control x-zoom-move', {
            'x-zoom-control--disabled': isMoveDisabledRight
          })}
            icon='circle-arrow-right'
            onClick={() => this.handleXZoomMove(xZoom, 'right')} />
          <Icon className={classNames('x-zoom-control x-zoom-move', {
            'x-zoom-control--disabled': isMoveDisabledLeft
          })}
            icon='circle-arrow-left'
            onClick={() => this.handleXZoomMove(xZoom, 'left')} />
          <Icon className='x-zoom-control x-zoom-refresh' icon='refresh'
            onClick={this.handleXZoomReset} />
        </div>
        {/* </div> */}

        {/* <div className='y-zoom'>
          <ControlGroup>
            <Label className='select-graph-label'>Y-Axis Zoom for </Label>
            <Popover className='select-graph-menu' content={this.renderChartListMenu()} position={Position.TOP}>
              <Button text={selectedChartLabel} />
            </Popover>
            <Slider
              className='y-zoom-slider'
              min={50}
              max={200}
              stepSize={10}
              labelStepSize={10}
              onChange={this.handleYZoomChange}
              onRelease={this.handleYZoomRelease}
              value={yZoom}
              showTrackFill={false}
              labelRenderer={v => `${v}%`}
            />
          </ControlGroup>
        </div> */}
      </div>
    );
  }
}