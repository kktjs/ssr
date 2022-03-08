import { createModel } from "@rematch/core"

export default createModel()({
  name: "login",
  state: {
    title: "login 标题"
  },
  effects: () => ({
    async very(_, { login }) {
      console.log("打印 login", login.title)
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