import { init } from '@rematch/core';
import * as global from '../models/global';
import request from '../utils/request';

async function readyStore(mstore, initialState) {
  const promises = [];
  if (initialState) {
    Object.keys(initialState).forEach((name) => {
      promises.push(import(`../models/${name}.js`).then((md) => {
        const model = md.default || md;
        model.state = initialState[name];
        model.name = name;
        return model;
      }));
    });
    const models = (await Promise.all(promises));
    models.forEach(async (model) => {
      await mstore.model({ ...model });
    });
  }
}

const initStates = {
  global: global.default,
};

if (typeof window !== 'undefined' && window._KKT_STORE && window._KKT_STORE.global && initStates.global.state) {
  initStates.global.state = { ...global.default.state, ...window._KKT_STORE.global };
}

export const store = init({
  models: initStates,
  plugins: [
    {
      async onStoreCreated(mstore) {
        if (typeof window !== 'undefined') {
          await readyStore(mstore, window._KKT_STORE);
        }
        mstore.api = request;
        return mstore;
      },
    },
  ],
});
