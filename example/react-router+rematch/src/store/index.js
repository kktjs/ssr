import { init } from '@rematch/core';
import * as global from '../models/global';
import request from '../utils/request';

export const store = init({
  models: {
    global: global.default,
  },
  plugins: [
    {
      onStoreCreated(mstore) {
        mstore.api = request;
        return mstore;
      },
    },
  ],
});

// Initial Rematch State
export default async function createStore(initialState) {
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
    models.forEach((model) => {
      store.model({ ...model });
    });
  }
}
