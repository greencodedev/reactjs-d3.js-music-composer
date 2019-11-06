/**
 *@ParentComponent: Home
 *@ChildComponent:
 *@Props:
 */
import React from 'react';

import { Dialog, Button, Classes } from '@blueprintjs/core';

import { Store } from '../store';
import API from '../api';

export default function NeedReload() {
  const { state, actions } = React.useContext(Store);

  const handleReload = async () => {
    await API.saveProject(state.charts, state.project, state.instruments, false, actions.project_update);
    document.location.reload();
  }

  return (
    <Dialog
      className='bp3-dark need-reload'
      title='Need Reload'
      isOpen={true}
      autoFocus={true}
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      enforceFocus={true}
      usePortal={true}
      onClose={handleReload}
    >
      <div id='login-panel' className={Classes.DIALOG_BODY}>
        A new version of RoboComposer is available. Need to reload your page.
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button intent='primary' text='OK' onClick={handleReload} />
        </div>
      </div>
    </Dialog>
  );
}

