import request from '../utils/request';

export default {
  state: {
    test: 'global state test',
    name: 'kkt ssr',
    token: null,
    userinfo: null,
  },
  reducers: {
    verify: (state, payload) => ({ ...state, ...payload }),
    updateState: (state, payload) => ({ ...state, ...payload }),
  },
  effects: () => ({
    async verify({ token }, { global }) {
      const verify = await request('/api/user/verify', { body: { token } });
      const state = { ...global, test: 'test:global:111----------->' };
      state.token = verify ? token : null;
      state.userinfo = verify;
      await this.updateState({ ...state });
    },
  }),
};
