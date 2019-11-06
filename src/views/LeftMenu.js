/**
 *@ParentComponent: Home
 *@ChildComponent: 
 *@Props:
 */
import React from 'react';

import { ButtonGroup, Button } from "@blueprintjs/core";

import { Store } from '../store';


export default function LeftMenu() {
  const { state, actions } = React.useContext(Store);

  return (
    <div className='left-menu'>
      <ButtonGroup minimal={true} vertical={true} large={true}>
        {/* <Button icon="double-caret-horizontal" intent={isZoomModeH ? 'primary' : 'none'}
          onClick={() => actions.toggleZoomModeH(!isZoomModeH)} /> */}

        <Button icon="layout-balloon" intent={state.isShowInstruments ? 'primary' : 'none'}
          onClick={() => actions.toggle_instruments(!state.isShowInstruments)} />

        <Button icon="double-caret-vertical" intent={state.isZoomModeV ? 'primary' : 'none'}
          onClick={() => actions.toggle_zoom_mode_v(!state.isZoomModeV)} />

        <Button icon="pivot" intent={state.isSyncPointMode ? 'primary' : 'none'}
          onClick={() => actions.toggle_sync_point_mode(!state.isSyncPointMode)} />

        <Button icon="music" intent={state.isAudioPlayer ? 'primary' : 'none'}
          onClick={() => actions.toggle_audio_player(!state.isAudioPlayer)} />

        <Button icon="film" intent={state.isVideoPlayer ? 'primary' : 'none'}
          onClick={() => actions.toggle_video_player(!state.isVideoPlayer)} />

        <Button icon="zoom-in" intent={state.isZoom ? 'primary' : 'none'}
          onClick={() => actions.toggle_zoom(!state.isZoom)} />
      </ButtonGroup>
    </div>
  );
}
