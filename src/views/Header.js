/**
 *@ParentComponent: Home
 *@ChildComponent: 
 *@Props:
 */
import React from 'react';
import i18next from 'i18next';

import { Navbar, Button, Popover, Menu, MenuItem, Position, Toaster, Intent } from '@blueprintjs/core';

import API from '../api';
import { Store } from '../store';
import { LANGS, getLang } from '../i18n';

import RoboStatus from './RoboStatus';

export default function Header() {
  const { state, actions } = React.useContext(Store);

  let userLangs = navigator.languages || [];
  let moreLangs = navigator.languages.map((lang) => {
    return lang.split('-')[0];
  });
  userLangs = Array.from(new Set([].concat(userLangs, moreLangs)));

  const mainLangs = [];
  const otherLangs = [];
  LANGS.forEach(lang => {
    if (userLangs.includes(lang.key)) {
      mainLangs.push(lang);
    } else {
      otherLangs.push(lang);
    }
  });

  const renderLangMenu = () => {
    function renderLangBloc(llangs) {
      return llangs.map(ll => (
        <MenuItem
          key={ll.key}
          active={ll.key === getLang()}
          text={ll.local_name} onClick={async () => {
            if (ll.key === getLang()) return;

            Toaster.create().show({ message: 'The page is going to reload.', intent: Intent.PRIMARY, timeout: 2000 });
            await projectSave(false, false);
            i18next.changeLanguage(ll.key);
            document.location.reload();
          }} />
      ));
    }

    return (
      <Menu className='header-menu-lang'>
        {renderLangBloc(mainLangs)}
        <Menu.Divider />
        <div className='header-langs-more'>
          {renderLangBloc(otherLangs)}
        </div>
      </Menu>
    );
  }

  const renderUserMenu = () => {
    return (
      <Menu className='header-menu-user'>
        <MenuItem
          text='Profile'
          onClick={() => {
            alert('profile');
          }} />
        <MenuItem
          text='Logout'
          onClick={() => {
            localStorage.removeItem('uid');
            document.location.reload();
          }} />
      </Menu>
    );
  }

  const projectSave = async (startRobo, notify = true) => {
    await API.saveProject(state.charts, state.project, state.instruments, startRobo, actions.project_update);
    /*
    if (notify) {
      Toaster.create().show({ message: 'Project saved!', intent: Intent.PRIMARY, timeout: 2000 });
    }
    */

  }

  const pid = localStorage.getItem('pid');
  const uid = localStorage.getItem('uid');

  return (
    <Navbar className='header'>
      <Navbar.Group>
        <Navbar.Heading>
          <a className='logo' href='/' target='_self'>
            <img src='./img/logo.png' alt='RoboComposer' />
          </a>
        </Navbar.Heading>
        <Navbar.Divider />
        <Button className='bp3-minimal bp3-large up-title' icon='series-configuration' text={i18next.t('label.settings')}
          onClick={() => actions.toggle_settings()} />
        <Button className='bp3-minimal bp3-large up-title' icon='series-add' text={i18next.t('label.save_project')}
          onClick={() => projectSave(false)} />
        <Button className='bp3-minimal bp3-large up-title' icon='scatter-plot' text={i18next.t('label.start_robocomposing')}
          onClick={() => projectSave(true)} />

        {state.project.roboStatus ?
          <RoboStatus status={state.project.roboStatus} />
          : null}

        {state.project.roboStatus === 'COMPLETE' ?
          <div className='mp3'>
            <a href={`https://robocomposer.com/mp3/${pid}.mp3`} target='_blank' rel='noopener noreferrer'>MP3</a>
            <a href={`https://robocomposer.com/pdf/${pid}.pdf`} target='_blank' rel='noopener noreferrer'>PDF</a>
            <a href={`https://robocomposer.com/mid/${pid}.mid`} target='_blank' rel='noopener noreferrer'>MID</a>
          </div>
          : null}

      </Navbar.Group>
      <Navbar.Group align='right'>
        <Button className='bp3-minimal bp3-large' icon='projects'
          text={state.project.project_name}
          onClick={() => actions.toggle_projects()} />
        <Navbar.Divider />
        {!uid || !state.userName
          ? <Button className='bp3-minimal bp3-large up-title' text={'Login'} icon='log-in'
            onClick={() => actions.toggle_login()} />
          : <Popover content={renderUserMenu()} position={Position.BOTTOM}>
            <Button className='bp3-minimal bp3-large up-title' text={state.userName} rightIcon='caret-down' />
          </Popover>}
        <Popover content={renderLangMenu()} position={Position.BOTTOM}>
          <Button className='bp3-minimal bp3-large up-title' text={i18next.t('lang.local_name')} rightIcon='caret-down' />
        </Popover>
      </Navbar.Group>
    </Navbar>
  );
}

