/**
 * @ParentComponent:
 * @ChildComponent: Home 
 * @props:
 */
import React from 'react';
import ReactDOM from 'react-dom';

import API from './api';
import { StoreProvider, Store } from './store';
import { loadLang } from './i18n';

import Home from './views/Home';

import './styles/index.scss';

function Main() {
  const { state, actions } = React.useContext(Store);

  const colorScheme = localStorage.getItem('color_scheme') || 'th0';
  document.body.className = `rc-${colorScheme}`;
  
  React.useEffect(() => {
    loadLang(() => API.loadProject(state.project).then(actions.data_update));
  }, []);

  if (!state.charts.length) {
    return (
      <div className={`loading-bar rc-${colorScheme}`}>
        <div id='loading'></div>
      </div>
    );
  }
  
  return (
    <Home />
  );
}

ReactDOM.render(
  <StoreProvider>
    <Main />
  </StoreProvider>,
  document.getElementById('main')
);