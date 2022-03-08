export default {
  state: {
    test: 'home state test',
  },
  reducers: {
    updateState: (state, payload) => ({ ...state, ...payload }),
  },
  effects: {},
};
