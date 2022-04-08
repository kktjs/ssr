import { init, Models } from '@rematch/core';
import cookie from 'cookiejs';
import global from '../models/global';
import stores, { Store, RootModel, FullModel } from '../models';

let storeInit: any = {};

export const store = (): Store => storeInit;
export const createStore = async (initialState = stores.getState() || {}) => {
  const promises: Promise<void>[] = [];

  Object.keys(initialState).forEach((name) => {
    promises.push(import(`../models/${name}.js`).then((md) => {
      const model = md.default || md;
      model.state = initialState[name] || {};
      model.name = name;
      return model;
    }));
  });

  const models = await Promise.all(promises);

  let model: any = { global: global }

  if (models.length > 0) {
    model = models
  }

  storeInit = init<RootModel, FullModel>({
    models: model,
    plugins: [
      {
        createMiddleware: () => () => next => async (action) => {
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
  });
  return stores;
};
