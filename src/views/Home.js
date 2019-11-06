/**
 *@ParentComponent:Main
 *@ChildComponent: Header, LeftMenu, Chart, Settings, Login, Projects, AudioPlayer, Instruments, Zoom, NeedReload
 *@props:
 */
import React from 'react';

import { ResizeSensor } from "@blueprintjs/core";

import { Store } from '../store';
import chartRCMan from '../chartRC/chartRCMan';
import API from '../api';

import Header from './Header';
import Settings from './Settings';
import LeftMenu from './LeftMenu';
import Login from './Login';
import Projects from './Projects';
import Player from './player/Player';
import AudioPlayer from './player/AudioPlayer';
import Zoom from './Zoom';
import Chart from './Chart';
import NeedReload from './NeedReload';
import Instruments from './Instruments';

export default function Home() {
  const { state, actions } = React.useContext(Store);

  React.useEffect(() => {
    API.needReload().then(need => {
      if (need) actions.set_need_reload();
    })
  });

  let isFirst = true;
  function handleResize() {
    if (isFirst) {
      isFirst = false;
    } else {
      chartRCMan.rebuildAllCharts(true);
    }
  }

  return (
    <ResizeSensor onResize={handleResize}>
      <div className='bp3-dark root'>
        <Header />

        <div className="columns column-left-menu is-gapless" style={{ marginBottom: 4 }}>
          <div className="column is-narrow">
            <LeftMenu />
          </div>
          <div className="column column-chart-grid">
            <Chart />
          </div>
        </div>

        <Settings isOpen={state.isShowSettings} charts={state.charts} actions={actions} project={state.project}
          instruments={state.instruments}
          general={{ isShowHelpTooltip: state.isShowHelpTooltip, colorScheme: state.color_scheme }} />

        <Login isOpen={state.isShowLogin} actions={actions} />

        <Projects isOpen={state.isShowProjects} projects={state.projects} project={state.project} actions={actions} />

        {state.isShowInstruments ? <Instruments isOpen={state.isShowInstruments} state={state} actions={actions} /> : null}

        {
          state.isAudioPlayer ?
            <AudioPlayer toggle_player={() => {
              actions.toggle_audio_player(false);
            }} />
            : null
        }

        {state.isVideoPlayer ?
          <Player toggle_player={() => {
            actions.toggle_video_player(false);
          }} />
          : null}

        {state.isZoom ?
          <Zoom data={state.charts} actions={actions} />
          : null}

        {state.isNeedReload ? <NeedReload /> : null}
      </div>
    </ResizeSensor>
  )
};