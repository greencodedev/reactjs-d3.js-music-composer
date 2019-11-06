/**
 *@ParentComponent: Home
 *@ChildComponent: isOpen
 *@Props:
 */
import React, { Component } from 'react';
import i18next from 'i18next';

import { Dialog, Button, FormGroup, InputGroup, Classes } from '@blueprintjs/core';

import API from '../api';
import { validateEmail } from '../utils';

export default class Login extends Component {
  state = {
    email: '',
    name: '',
    isEmailNotFalid: false,
  };

  handleClose = () => {
    this.props.actions.toggle_login();
  }

  handleLogin = () => {
    if (this.state.email.trim().length > 0) {
      const valid = validateEmail(this.state.email.trim());

      if (valid) {
        API.sendAuthorizationEmail(this.state.email, this.state.name);

        this.handleClose();

        this.setState({
          email: '',
          name: ''
        });
      } else {
        this.setState({ isEmailNotFalid: true });
      }
    }
  }

  handleKeyDown = (event) => {
    if (this.state.isEmailNotFalid) {
      this.setState({ isEmailNotFalid: false });
    }

    if (event.keyCode === 13) {
      this.handleLogin();
    }
  }

  render() {
    return (
      <Dialog
        className='bp3-dark login'
        icon='settings'
        title='Login'
        isOpen={this.props.isOpen}
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        usePortal={true}
        onClose={this.handleClose}
      >
        <div id='login-panel' className={Classes.DIALOG_BODY}>
          <FormGroup
            label={i18next.t('label.login_name')}
            labelFor='text-name'
            inline={true}
          >
            <InputGroup
              id='text-name'
              className='input_name'
              value={this.state.name}
              onChange={(event) => this.setState({ name: event.target.value })}
              onKeyDown={this.handleKeyDown}
            />
          </FormGroup>
          <FormGroup
            label={i18next.t('label.login_email')}
            labelFor='text-email'
            inline={true}
          >
            <InputGroup
              id='text-email'
              className={`input_email ${this.state.isEmailNotFalid ? 'input_email-fail' : ''}`}
              value={this.state.email}
              onChange={(event) => this.setState({ email: event.target.value })}
              onKeyDown={this.handleKeyDown}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent='primary' text={i18next.t('label.login_ok')} onClick={this.handleLogin} />
          </div>
        </div>
      </Dialog>
    );
  }
}
