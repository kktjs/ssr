export default {
  state: {
    test: 'global state test',
  },
  reducers: {
    updateState: (state, payload) => ({ ...state, ...payload }),
  },
  effects: {
    async verify(payload, rootState) {
      console.log(rootState); // eslint-disable-line
    },
  },
};
