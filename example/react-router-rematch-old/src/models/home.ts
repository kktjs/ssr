import { createModel } from "@rematch/core"
import { RootModel } from "./index"
export default createModel<RootModel>()({
  state: {
    test: 'home state test',
  },
  reducers: {
    updateState: (state, payload) => ({ ...state, ...payload }),
  },
  effects: {},
});
