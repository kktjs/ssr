export default {
  state: {
    test: 'global state test',
  },
  reducers: {
    updateState: (state, payload) => ({ ...state, ...payload }),
  },
  effects: {},
};
