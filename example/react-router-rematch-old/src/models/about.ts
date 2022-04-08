import { createModel } from "@rematch/core"
import { RootModel } from "./index"
export default createModel<RootModel>()({
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
});
