import { createModel } from "@rematch/core"
import { RootModel } from "./index"

export default createModel<RootModel>()({
  name: "demo",
  state: {
    title: "demo 标题"
  },
  effects: () => ({
    async very(_, store) {
      console.log("打印 demo", store.demo.title)
    }
  })
})