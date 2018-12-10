// import React from 'react';
// import loadable from 'react-dynamic-loadable';
import loadable from '../utils/loadable';
import { store } from '../store';
import './index.css';

// wrapper of dynamic
const dynamicWrapper = (models, component) => loadable({
  component,
  // LoadingComponent: () => <div>...LOADING...</div>,
  models: () => models.map((m) => {
    return import(`../models/${m}.js`).then((md) => {
      const model = md.default || md;
      store.model({ name: m, ...model });
    });
  }),
});


export const getRouterData = () => {
  let conf = {
    '/': {
      name: 'page-home',
      component: dynamicWrapper(['home'], () => import(/* webpackChunkName: 'page-home' */ './home')),
      exact: true,
    },
    '/about': {
      name: 'page-about',
      component: dynamicWrapper(['about'], () => import(/* webpackChunkName: 'page-about' */ './about')),
      exact: true,
    },
    '/repos': {
      name: 'page-repos',
      component: dynamicWrapper([], () => import(/* webpackChunkName: 'page-repos' */ './repos')),
      exact: true,
    },
    // '/repos/detail/:id': {
    //   file: './repos/detail',
    //   component: dynamicWrapper([], () => import(/* webpackChunkName: 'page-detail' */ './repos/detail')),
    //   exact: true,
    // },
    // '/:username': {
    //   file: './username',
    //   component: dynamicWrapper([], () => import(/* webpackChunkName: 'page-username' */ './username')),
    //   exact: true,
    // },
  };
  conf = Object.keys(conf).map((path) => {
    return { ...conf[path], path };
  });
  return conf;
};
