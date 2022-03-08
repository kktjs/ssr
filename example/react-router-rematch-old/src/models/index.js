import { init } from '@rematch/core';
import home from "./home"
import global from "./global"
import about from "./about"

export default init({
  models: {
    home,
    global,
    about
  },

})