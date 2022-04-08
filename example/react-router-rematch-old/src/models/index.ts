
// @ts-ignore
import {
  init,
  Models,
  Model,
  RematchRootState,
  RematchDispatch,
} from '@rematch/core';
import loading, { ExtraModelsFromLoading } from '@rematch/loading';

import home from "./home"
import global from "./global"
import about from "./about"
import cookie from 'cookiejs';

export const models = {
  home,
  global,
  about,
}

export interface RootModel extends Models<RootModel> {
  home: typeof home,
  global: typeof global,
  about: typeof about,
}

export type FullModel = ExtraModelsFromLoading<RootModel>

export const store = init<RootModel, FullModel>({
  models,
  plugins: [
    loading(),
    {
      createMiddleware: () => () => next => async (action) => {
        if (typeof window !== 'undefined') {
          const token = cookie.get('token');
          if (token) {
            await cookie.set('token', token, 1);
          }
        }
        return next(action);
      },
    }],
});

export const { dispatch, addModel } = store;
export type Store = typeof store;
export type AddModel = typeof addModel;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel, FullModel>;
export type ModelDefault<T = any> = Model<RootModel, T>;

export default store;
