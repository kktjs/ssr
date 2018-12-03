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

export default async function createStore(initialState) {
  const oldState = store.getState();
  if (initialState) {
    Object.keys(initialState).forEach((name) => {
      let state = { ...initialState[name] };
      if (oldState[name]) {
        state = { ...oldState[name], ...state };
      }
      store.model({ name, state });
    });
  }
}
