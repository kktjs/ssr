import { createModel } from "@rematch/core"

export default createModel()({
  name: "demo",
  state: {
    title: "demo 标题"
  },
  effects: () => ({
    async very(_, { demo }) {
      console.log("打印 demo", demo.title)
    }
  })
})