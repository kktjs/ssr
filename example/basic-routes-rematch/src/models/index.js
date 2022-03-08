import { init } from "@rematch/core"
import loading from "@rematch/loading"
import login from "./login"
import demo from "./demo"
const models = { demo, login }

const store = init({
  models,
  plugins: [loading()]
})


export default store;
