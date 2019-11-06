import { useState } from 'react';

const createHook = (state, actions) => (([state, setState]) => ([({ ...actions(state, setState) }), state]))(useState(state));

class Hook {
  state = null;
  hook = null;

  store = null;
  actions = null;

  constructor(store, actions) {
    this.store = store;
    this.actions = actions;
  }

  initHook = () => {
    const [_hook, _state] = createHook(this.store, this.actions);
    this.state = _state;
    this.hook = _hook;

    return { [`state`]: this.state, [`hook`]: this.hook };
  }
}

export default Hook;