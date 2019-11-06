/**
 *@ParentComponent: Home
 *@ChildComponent: isOpen, projects
 *@Props:
 */
import React, { Component } from 'react';
import i18next from 'i18next';
import { Dialog, Button, Classes, ControlGroup, Alignment, FormGroup, ButtonGroup, InputGroup, Icon, Text } from '@blueprintjs/core';

import API from '../api';

export default class Projects extends Component {
  state = {
    projects: this.props.projects,
    new_project_name: '',
    filter_favorite: false,
    sort_name: 'asc',
    sort_date_create: null,
    sort_date_update: null,
    loading: false,

  };

  handleClose = () => {
    this.props.actions.toggle_projects();
  }

  handleSelectProject = (project) => {
    if (project.pid) {
      localStorage.setItem('pid', project.pid);
      document.location.reload();
    }
  }

  handleCreateProject = async () => {
    this.setState({
      loading: true,
    })

    const projects = await API.createNewProject(this.state.new_project_name);

    this.setState({
      projects,
      loading: false,
    });
  }

  handleRemoveProject = (project) => {
    API.removeProject(project.pid);

    this.setState({
      projects: this.state.projects.filter(pr => pr.pid !== project.pid)
    })
  }

  handleToggleStatus = (name) => {
    if (name === 'filter_favorite') {
      this.setState({
        filter_favorite: !this.state.filter_favorite,
      });

      return;
    }

    let sort_name, sort_date_create, sort_date_update;

    if (name === 'sort_name') {
      sort_date_create = null;
      sort_date_update = null;

      sort_name = this.state.sort_name === 'asc' ? 'desc' : 'asc';
    }

    if (name === 'sort_date_create') {
      sort_name = null;
      sort_date_update = null;

      sort_date_create = this.state.sort_date_create === 'asc' ? 'desc' : 'asc';
    }

    if (name === 'sort_date_update') {
      sort_date_create = null;
      sort_name = null;

      sort_date_update = this.state.sort_date_update === 'asc' ? 'desc' : 'asc';
    }

    this.setState({
      sort_name,
      sort_date_create,
      sort_date_update,
    });
  }

  render() {
    let { projects, new_project_name, filter_favorite, sort_name, sort_date_create, sort_date_update } = this.state;
    let { project } = this.props;


    if (filter_favorite) {
      projects = projects.filter(a => a.favorite === '1');
    }

    if (sort_name) {
      projects = projects.sort((a, b) => {
        var _a = sort_name === 'asc' ? a : b;
        var _b = sort_name === 'asc' ? b : a;
        if (_a.name > _b.name) return 1;
        if (_a.name < _b.name) return -1;
        return 0;
      });
    } else if (sort_date_create) {
      projects = projects.sort((a, b) => {
        var _a = sort_date_create === 'asc' ? a : b;
        var _b = sort_date_create === 'asc' ? b : a;
        if (_a.datetime_created > _b.datetime_created) return 1;
        if (_a.datetime_created < _b.datetime_created) return -1;
        return 0;
      });
    } else if (sort_date_update) {
      projects = projects.sort((a, b) => {
        var _a = sort_date_update === 'asc' ? a : b;
        var _b = sort_date_update === 'asc' ? b : a;
        if (_a.datetime_last_update > _b.datetime_last_update) return 1;
        if (_a.datetime_last_update < _b.datetime_last_update) return -1;
        return 0;
      });
    }

    return (
      <Dialog
        className='bp3-dark projects'
        icon='projects'
        title='Projects'
        isOpen={this.props.isOpen}
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        usePortal={true}
        onClose={this.handleClose}
      >
        <div id='projects-panel' className={Classes.DIALOG_BODY}>
          <div className='new-project-panel'>
            <FormGroup
              labelFor='text-name'
              inline={true}
            >
              <InputGroup
                id='text-name'
                className='input_name'
                placeholder={i18next.t('label.projects_project_name')}
                value={new_project_name}
                onChange={(event) => this.setState({ new_project_name: event.target.value })}
              />
              <Button className='new-project' alignText={Alignment.CENTER}
                onClick={() => this.handleCreateProject()}
              >{i18next.t('label.projects_create')}</Button>
              {this.state.loading ? <div className='loading-status' id='loading'></div> : null}
            </FormGroup>
          </div>
          <div className='project-sort'>
            <ButtonGroup minimal={true} fill={true}>
              <div className='projects-count' title='Projects count'>{projects.length}</div>
              <Button
                minimal={!sort_name}
                title={`${i18next.t('label.projects_sort_by_project_name')} (${sort_name || 'asc'})`}
                icon={sort_name === 'asc' || !sort_name ? 'sort-alphabetical' : 'sort-alphabetical-desc'}
                onClick={() => this.handleToggleStatus('sort_name')}
              />
              <Button
                minimal={!sort_date_create}
                title={`${i18next.t('label.projects_sort_by_creation_date')} (${sort_date_create || 'asc'})`}
                icon={sort_date_create === 'asc' || !sort_date_create ? 'sort-asc' : 'sort-desc'}
                onClick={() => this.handleToggleStatus('sort_date_create')}
              />
              <Button
                minimal={!sort_date_update}
                title={`${i18next.t('label.projects_sort_by_last_updated')} (${sort_date_update || 'asc'})`}
                icon={sort_date_update === 'asc' || !sort_date_update ? 'sort-numerical' : 'sort-numerical-desc'}
                onClick={() => this.handleToggleStatus('sort_date_update')}
              />
              <Button
                title={`${i18next.t('label.projects_filter_by_favourite')}`}
                icon={!filter_favorite ? 'star-empty' : 'star'}
                onClick={() => this.handleToggleStatus('filter_favorite')}
              />
            </ButtonGroup>
          </div>
          <div className='datetime-header'>
            <span className='project_name'>{i18next.t('label.projects_project_name')}</span>
            <span className='date_created'>Date Created</span>
            <span className='date_last'>Date Last Update</span>
          </div>
          <div className='project-list'>
            {projects.map(pr => {
              const isProjectCurrent = pr.name === project.project_name;

              return (
                <ControlGroup key={pr.pid} vertical={false} className='project-item project-item-current'>
                  <Icon className='favorite' icon={pr.favorite === '1' ? 'star' : 'star-empty'} />
                  <Button className='bp3-minimal name' alignText={Alignment.CENTER}
                    onClick={() => this.handleSelectProject(pr)}
                    disabled={isProjectCurrent}
                  >{(pr.name || '<no name>') + (isProjectCurrent ? ' [Selected]' : '')}</Button>
                  <Text className='datetime'>{pr.datetime_created}</Text>
                  <Text className='datetime'>{pr.datetime_last_update}</Text>
                  <Button className='bp3-minimal remove' icon='trash' onClick={() => this.handleRemoveProject(pr)} disabled={isProjectCurrent} />
                </ControlGroup>
              );
            })}
          </div>
        </div>
      </Dialog>
    );
  }
}
