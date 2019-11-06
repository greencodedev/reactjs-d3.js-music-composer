/**
 *@ParentComponent: Home
 *@ChildComponent: Player, Zoom
 *@Props:isOpen
 */
import React, { Component } from 'react';
import { Card, ControlGroup, Label, Icon } from "@blueprintjs/core";

import Player from './Player';
import Zoom from '../zoom/Zoom';

import './instruments.scss';

const INSTRUMENTS = {
  player: <Player />,
  zoom: <Zoom />
};

export default class Instruments extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const nextInstrumnets = nextProps.instruments.map(n => n.name).join(',');
    const nowInstruments = this.props.instruments.map(n => n.name).join(',');

    return nextInstrumnets !== nowInstruments;
  }

  render() {
    const { instruments } = this.props;

    if (!instruments.length) {
      return null;
    }

    if (instruments.length === 1 && instruments[0].name === 'player') {
      return null;
    }

    if (instruments.length === 1 && instruments[0].name === 'audio_player') {
      return null;
    }

    return (
      <Card className='instruments'>
        <div className="columns is-gapless" style={{ marginBottom: 2 }}>
          <div className="column is-narrow">
            <ControlGroup className='instruments-header'>
              <Label className='instruments-title'>Instruments</Label>
              <Icon className='instruments-title-btn' icon="cross" onClick={this.props.hideAll} />
            </ControlGroup>
          </div>
          <div className="column">
            {instruments.map(instrument => {
              const name = instrument.name;

              if (name === 'player') {
                return null;
              }

              if (name === 'audio_player') {
                return null;
              }

              return (
                <div key={name} className={`instrument ${name}`}>
                  <div className='title'>
                    <div className='title-label'>{name}</div>
                    <Icon className='title-btn' icon="small-cross" onClick={this.props[`toggle_${name}`]} />
                  </div>
                  {INSTRUMENTS[name]}
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    );
  }
}

// export default connect(
//   state => {
//     let instruments = getInstruments(state);
//     instruments = Object.keys(instruments)
//       .filter(k => instruments[k].active)
//       .map(k => instruments[k]);

//     return {
//       instruments,
//     };
//   },
//   dispatch => ({
//     hideAll: () => dispatch(actions.instrumentsHideAll()),
//     toggle_player: () => dispatch(actions.instrumentsTogglePlayer()),
//     toggle_zoom: () => dispatch(actions.instrumentsToggleZoom())
//   })
// )(Instruments);