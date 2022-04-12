import { init, } from '@rematch/core';
import cookie from 'cookiejs';
import global from '../models/global';
import stores, { Store, RootModel, FullModel } from '../models';

let storeInit = init<RootModel, FullModel>({
  models: {
    global: global
  },
  plugins: [
    {
      createMiddleware: () => () => next => (action) => {
        if (typeof window !== 'undefined') {
          const token = cookie.get('token');
          if (token) {
            cookie.set('token', token, 1);
          }
        }
        // do something here
        return next(action);
      },
    },
  ],
});
export const store = (): Store => storeInit;
export const createStore = async (initialState = stores.getState() || {}) => {
  const promises: Promise<void>[] = [];
  Object.keys(initialState).forEach((name) => {
    if (name !== "loading") {
      promises.push(import(`../models/${name}.ts`).then((md) => {
        const model = md.default || md;
        model.state = initialState[name] || {};
        model.name = name;
        return storeInit.addModel({ ...model });
      }));
    }
  });
  await Promise.all(promises);
  return stores;
};
