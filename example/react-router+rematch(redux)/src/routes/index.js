import React from 'react';
// import dynamic from 'react-dynamic-loadable';
import store from '../store';
import dynamic from '../utils/dynamicLoadable';
import '../client.module.css';

// wrapper of dynamic
const dynamicWrapper = (models, component) => dynamic({
  component,
  LoadingComponent: () => <div>...LOADING...</div>,
  models: () => models.map((m) => {
    return import(`../models/${m}.js`).then((md) => {
      const model = md.default || md;
      store.model({ name: m, ...model });
    });
  }),
});

export default {
  '/': {
    file: './home',
    component: dynamicWrapper(['home'], () => import('./home')),
    exact: true,
  },
  '/about': {
    file: './abouts',
    component: dynamicWrapper([], () => import('./abouts')),
    exact: true,
  },
  '/repos': {
    file: './repos',
    component: dynamicWrapper([], () => import('./repos')),
    exact: true,
  },
  '/repos/detail/:id': {
    file: './repos/detail',
    component: dynamicWrapper([], () => import('./repos/detail')),
    exact: true,
  },
  '/:username': {
    file: './username',
    component: dynamicWrapper([], () => import('./username')),
    exact: true,
  },
};
