import React, { Component } from 'react';
import i18next from 'i18next';

import { Dialog, Button, Classes, Checkbox, Tab, Tabs } from '@blueprintjs/core';
import { groupBy } from '../utils';

import API from '../api';

export default class Instruments extends Component {
  state = {
    instruments: [].concat([...this.props.state.instruments]),
    pre_instruments: [].concat([...this.props.state.instruments]),
    // selected: this.props.state.instruments.filter(it => it.checked).map(it => it.object_id),
    selectedTab: null,
  };

  handleClose = () => {
    this.setState({
      instruments: this.state.pre_instruments,
      // selected: this.props.state.instruments.filter(it => it.checked).map(it => it.object_id),
    });
    this.props.actions.toggle_instruments();
  }

  handleOk = () => {
    const instruments = this.state.instruments;
    // const instruments = this.state.instruments.map(it => ({
    //   ...it,
    //   checked: this.state.selected.includes(it.object_id),
    // }));

    this.props.actions.instruments_update(instruments);
    this.handleClose();

    API.saveProject(this.props.state.charts, this.props.state.project, instruments, false);
  }

  doCheck = (id, checked) => {
    const instruments = this.state.instruments.map(inst => ({
      ...inst,
      checked: inst.object_id === id ? checked : inst.checked,
    }));
    // let selected = this.state.selected;

    // if (checked) {
    //   selected.push(id);
    // } else {
    //   selected = selected.filter(it => it !== id);
    // }

    this.setState({
      instruments: instruments,
    });
  }

  handleTabChange = (newTabId) => {
    this.setState({
      selectedTab: newTabId,
    })
  }

  renderTabContent = (instruments) => {
    // console.log('instuments');
    // console.log(instruments);

    // console.log('selected');
    // console.log(this.state.selected);

    return instruments.map(instrument => {
      const checked = instrument.checked; // || this.state.selected.includes(instrument.object_id);

      let title = instrument.object_name;
      const tr = i18next.t(`label.${instrument.object_id}`);
      if (!tr.startsWith('label.')) {
        title = tr;
      }

      return (
        <div key={instrument.object_id}>
          <Checkbox checked={checked} label={title}
            onChange={() => this.doCheck(instrument.object_id, !checked)} />
        </div>
      );
    })
  }

  render() {
    const { instruments } = this.state;
    const grouped = groupBy(instruments, 'category_id');
    const selectedTabId = this.state.selectedTab || (instruments.length && instruments[0].category_id);

    // console.log('--');
    // console.log(instruments);
    // console.log(grouped);

    return (
      <Dialog
        className='bp3-dark instr'
        icon='layout-balloon'
        title='Instruments'
        isOpen={this.props.isOpen}
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        usePortal={true}
        onClose={this.handleClose}
      >
        <div id='instrument-panel' className={Classes.DIALOG_BODY}>
          <Tabs id='TabsExample' animate={true} vertical={true}
            onChange={this.handleTabChange} selectedTabId={selectedTabId}>
            {/* <input className='bp3-input search' type='text' placeholder='Search...' 
              onChange={this.searchTab} />
            <br /> */}
            {Object.keys(grouped).map(tabId => {
              let title = tabId;
              if (grouped[tabId] && grouped[tabId].length) {
                title = grouped[tabId][0].category_id;

                const object_id = grouped[tabId][0].object_id;
                const tr = i18next.t(`help.${object_id}`);
                if (!tr.startsWith('help.')) {
                  title = tr;
                }
              }

              // debugger;

              return (<Tab key={tabId} id={tabId} title={title}
                className='tab-content'
                panel={this.renderTabContent(grouped[tabId])}
              />);
            })}
          </Tabs>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent='primary' text={'OK'} onClick={this.handleOk} />
          </div>
        </div>
      </Dialog>
    );
  }
}
