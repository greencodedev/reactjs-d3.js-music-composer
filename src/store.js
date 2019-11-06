import React from 'react';

import actions, { initialState } from './actions';

let _dispatch;

const _reducer = (state, action) => {
  var result = actions[action.type](state, action.payload);
  return { ...state, ...result };
};

const _actions = () => Object.keys(actions).reduce((acc, key) => {
  acc[key.toLowerCase()] = _dispatch(key);
  return acc;
}, {});

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(_reducer, initialState);
  _dispatch = type => payload => dispatch({ type, payload });

  return <Store.Provider value={{ state, actions: _actions() }}>{props.children}</Store.Provider>;
}

export const Store = React.createContext('');