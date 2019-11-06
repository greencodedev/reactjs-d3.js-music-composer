/**
 *@ParentComponent: Home
 *@ChildComponent: chartRCMan
 *@Props: isOpen, instruments, general, charts, project
 */
import React, { Component } from 'react';
import i18next from 'i18next';

import {
  Dialog, Button, FormGroup, InputGroup, NumericInput, RadioGroup, Radio, Classes, Switch, Popover, Position, Card, Elevation,
  Tab, Tabs, Text
} from '@blueprintjs/core';

import chartRCMan from '../chartRC/chartRCMan';
import API from '../api';

// import { chartUtils } from '../../utils';

export default class Settings extends Component {
  state = {
    general: {
      ...this.props.general,
      colorScheme: localStorage.getItem('color_scheme') || 'th0'
    },
    project: {
      project_name: '',
      favorite: '0',
      ...this.props.project,
    },
    selectedTabId: 'project',
    secondLost: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen) {
      document.body.addEventListener('keydown', this.handleKeyDown, true);
    } else {
      document.body.removeEventListener('keydown', this.handleKeyDown, true);
    }

    if (this.props.project !== nextProps.project) {
      this.setState({
        project: { ...nextProps.project }
      });
    }
  }

  handleClose = () => {
    this.props.actions.toggle_settings();
  }

  handleApply = (absolute) => {
    let charts = this.props.charts;
    const numberSeconds = this.state.project.number_seconds;

    let isSecondsCut = false;
    charts.forEach(ch => {
      const lastPoint = ch.points[ch.points.length - 1];
      if (lastPoint[0] > numberSeconds) {
        isSecondsCut = true;
      }
    })

    if (isSecondsCut && absolute !== true) {
      return;
    }

    this.props.actions.project_update({
      ...this.state.project,
      // project_name: this.state.project.project_name || ''
    });

    API.saveProject(charts, this.state.project, this.props.instruments, false);

    // this.props.updateSettings({
    //   ...this.state.general
    // });

    charts = charts.map(ch => {
      return {
        ...ch,
        settings: {
          ...ch.settings,
          maxX: numberSeconds,
        }
      }
    });

    // this.props.updateCharts(charts);

    this.handleClose();

    chartRCMan.rebuildMaxX(numberSeconds);
  }

  handleNo = () => {
    this.setState({
      project: { ...this.props.project },
      general: { ...this.props.general },
      secondLost: false
    });
  }

  handleChangeProject = (field, value) => {
    let secondLost_ = this.state.secondLost;

    if (field === 'beats_per_minute') {
      if (value < 30 || value > 200) {
        return;
      }
    }

    if (field === 'number_seconds') {
      if (value < 5 || value > 600) {
        return;
      }

      let isSecondsCut = false;
      const charts = this.props.charts;
      charts.forEach(ch => {
        const lastPoint = ch.points[ch.points.length - 1];
        if (lastPoint[0] > value) {
          isSecondsCut = true;
        }
      })

      if (isSecondsCut) {
        secondLost_ = true;
      }
    }

    const project = this.state.project;
    project[field] = value;

    this.setState({ project, secondLost: secondLost_ });
  }

  handleChangeGeneralHelp = (event) => {
    this.setState({
      general: {
        ...this.state.general,
        isShowHelpTooltip: event.target.checked
      }
    });

    this.props.actions.toggle_help_bubble();
  }

  handleChangeGeneralColorScheme = (value) => {
    this.setState({
      general: {
        ...this.state.general,
        colorScheme: value
      }
    });

    localStorage.setItem('color_scheme', value);
    document.body.className = `rc-${value}`;
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.handleApply();
    }
  }

  handleTabChange = (value) => {
    this.setState({
      selectedTabId: value
    })
  }

  renderColorSchemeList = () => {
    const colorSchemes = [
      { name: 'th0', label: i18next.t('label.settings_color_default') },
      { name: 'th1', label: i18next.t('label.settings_color_scheme_1') },
      { name: 'th2', label: i18next.t('label.settings_color_scheme_2') },
      { name: 'th3', label: i18next.t('label.settings_color_scheme_3') },
      { name: 'th4', label: i18next.t('label.settings_color_scheme_4') },
      { name: 'th5', label: i18next.t('label.settings_color_scheme_5') },
    ];

    return (
      <div className='color'>
        {colorSchemes.map(cs => {
          return (
            <div key={cs.name} className='color-item'>
              <Card
                className={`color-card ${cs.name}` + (this.state.general.colorScheme === cs.name ? ' selected' : '')}
                interactive={true}
                elevation={Elevation.THREE}
                onClick={(key) => this.handleChangeGeneralColorScheme(cs.name)}
              >
                <div className={`example-background`}>
                  <div className='color-title'>{cs.label}</div>
                </div>
              </Card>
            </div>
          );
        })}

      </div>
    );
  }

  render() {
    const { project, general } = this.state;

    return (
      <Dialog
        className='bp3-dark settings'
        icon='settings'
        title={i18next.t('label.settings')}
        isOpen={this.props.isOpen}
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        usePortal={true}
        onClose={this.handleClose}
      >
        <div id='settings-panel' className={Classes.DIALOG_BODY}>
          <Tabs id="TabsExample" onChange={this.handleTabChange} selectedTabId={this.state.selectedTabId}>
            <Tab id="project" title="Project" panel={
              <div className='project' onKeyDown={this.handleKeyDown}>
                <Switch checked={this.state.project.favorite === '1'} label={i18next.t('label.settings_project_favorite')} onChange={() => {
                  this.setState({
                    ...this.state,
                    project: {
                      ...this.state.project,
                      favorite: this.state.project.favorite === '0' ? '1' : '0',
                    }
                  })
                }} />
                <FormGroup
                  label={i18next.t('label.settings_project_project_name')}
                  labelFor='text-input2'
                  inline={true}
                >
                  <InputGroup
                    id='text-input2'
                    className='input_project_name'
                    placeholder='<no name>'
                    value={project.project_name}
                    onChange={(event) => this.handleChangeProject('project_name', event.target.value)}
                    onKeyDown={this.handleKeyDown}
                  />
                </FormGroup>
                <FormGroup
                  label={i18next.t('label.settings_project_number_of_seconds')}
                  inline={true}
                >
                  <NumericInput
                    className='input_number_seconds'
                    allowNumericCharactersOnly={true}
                    value={project.number_seconds}
                    min={5}
                    max={600}
                    minorStepSize={1}
                    buttonPosition='none'
                    onValueChange={(value) => this.handleChangeProject('number_seconds', value)}
                    onKeyDown={this.handleKeyDown}
                  />
                </FormGroup>
                <FormGroup
                  label={i18next.t('label.settings_project_beats_per_minute')}
                  inline={true}
                >
                  <NumericInput
                    className='input_beats_per_minute'
                    allowNumericCharactersOnly={true}
                    value={project.beats_per_minute}
                    min={30}
                    max={200}
                    minorStepSize={1}
                    buttonPosition='none'
                    onValueChange={(value) => this.handleChangeProject('beats_per_minute', value)}
                    onKeyDown={this.handleKeyDown}
                  />
                </FormGroup>
                <RadioGroup
                  label={i18next.t('label.settings_project_beats_per_measure')}
                  inline={true}
                  selectedValue={project.beats_per_measure}
                  onChange={(event) => this.handleChangeProject('beats_per_measure', +event.target.value)}
                >
                  <Radio label='2' value={2} />
                  <Radio label='3' value={3} />
                  <Radio label='4' value={4} />
                  <Radio label='5' value={5} />
                  <Radio label='6' value={6} />
                  <Radio label='7' value={7} />
                  <Radio label='8' value={8} />
                  <Radio label='9' value={9} />
                </RadioGroup>
              </div>
            } />
            <Tab id="color" title="Color" panel={this.renderColorSchemeList()} />
            <Tab id="general" title="General" panel={
              <div className='general'>
                <FormGroup
                  label={i18next.t('label.settings_general_show_help_tooltip')}
                  inline={true}
                >
                  <Switch checked={general.isShowHelpTooltip} onChange={this.handleChangeGeneralHelp} />
                </FormGroup>
                <FormGroup
                  label={i18next.t('label.settings_general_version')}
                  inline={true}
                >
                  <Text>[ {window.__VERSION__} ]</Text>
                </FormGroup>
              </div>
            } />
          </Tabs>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>

            <Popover
              content={
                this.state.secondLost ? <div className='ask-panel'>
                  Number of the graph seconds smaller than current setting for number of seconds.<br />
                  Do you want to continue? Some work will be lost.<br />
                  <Button text='No' onClick={this.handleNo} />
                  <Button text='Yes' onClick={() => this.handleApply(true)} />
                </div> : null
              } position={Position.LEFT}>
              <Button intent='primary' text={i18next.t('label.settings_project_apply')} onClick={this.handleApply} />
            </Popover>
          </div>
        </div>
      </Dialog>
    );
  }
}
