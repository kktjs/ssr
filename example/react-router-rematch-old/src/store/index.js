import { init } from '@rematch/core';
import cookie from 'cookiejs';
import global from '../models/global';
import stores from '../models';
// let storeInit = {};

export const store = () => stores;
export const createStore = async (initialState = {}) => {
  // const promises = [];

  // Object.keys({ about: "", global: "", home: "" }).forEach((name) => {
  //   promises.push(import(`../models/${name}.js`).then((md) => {
  //     const model = md.default || md;
  //     model.state = initialState[name] || {};
  //     model.name = name;
  //     return model;
  //   }));
  // });

  // const models = await Promise.all(promises);
  // console.log("models", models)
  // storeInit = init({
  //   models: models,
  //   // models: models.length > 0 ? models : {
  //   //   global: global.default,
  //   // },
  //   plugins: [
  //     {
  //       middleware: () => next => async (action) => {
  //         if (typeof window !== 'undefined') {
  //           const token = cookie.get('token');
  //           if (token) {
  //             await cookie.set('token', token, 1);
  //           }
  //         }
  //         // do something here
  //         return next(action);
  //       },
  //     },
  //   ],
  // });
  return stores;
};
