import { init } from '@rematch/core';
import home from "./home"
import global from "./global"
import about from "./about"
import cookie from 'cookiejs';

export default init({
  models: {
    home,
    global,
    about
  },
  plugins: [
    {
      middleware: () => next => async (action) => {
        if (typeof window !== 'undefined') {
          const token = cookie.get('token');
          if (token) {
            await cookie.set('token', token, 1);
          }
        }
        // do something here
        return next(action);
      },
    },
  ],
})