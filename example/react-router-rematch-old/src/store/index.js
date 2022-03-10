import { init } from '@rematch/core';
import cookie from 'cookiejs';
import global from '../models/global';
import stores from '../models';

let storeInit = {};

export const store = () => storeInit;
export const createStore = async (initialState = stores.getState() || {}) => {
  const promises = [];

  Object.keys(initialState).forEach((name) => {
    promises.push(import(`../models/${name}.js`).then((md) => {
      const model = md.default || md;
      model.state = initialState[name] || {};
      model.name = name;
      return model;
    }));
  });

  const models = await Promise.all(promises);
  storeInit = init({
    models: {},
    models: models.length > 0 ? models : {
      global: global,
    },
    models: {},
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
  });
  return stores;
};
