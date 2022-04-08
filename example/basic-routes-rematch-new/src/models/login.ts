import { createModel } from "@rematch/core"
import { RootModel } from "./index"

export default createModel<RootModel>()({
  name: "login",
  state: {
    title: "login 标题"
  },
  effects: () => ({
    async very(_, store) {
      console.log("打印 login", store.login.title)
    }
  }),
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
})