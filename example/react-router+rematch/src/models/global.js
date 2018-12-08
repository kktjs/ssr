import { store } from '../store';

export default {
  state: {
    test: 'global state test',
    name: 'kkt ssr',
  },
  reducers: {
    verify: (state, payload) => ({ ...state, ...payload }),
    updateState: (state, payload) => ({ ...state, ...payload }),
  },
  effects: {
    async verify(payload, rootState) {
      const dt = await store.api('/api/user/123');
      /* eslint-disable */
      console.log('~~~~~::::', payload);
      console.log('~~~~~::::', rootState);
      console.log('~~~~~::::', dt);
      /* eslint-enable */
      const state = { test: 'test:global:111----------->' };
      if (dt.username) {
        state.test = `${state.test} + ${dt.username}`;
      }
      await this.updateState({ ...state });
    },
  },
};
