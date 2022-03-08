export default {
  state: {
    test: 'abouts state test',
  },
  reducers: {
    updateState: (state, payload) => ({ ...state, ...payload }),
  },
  effects: {
    async verify() {
      // console.log(rootState); // eslint-disable-line
      // this.updateState({ test: 'test111' });
    },
  },
};
