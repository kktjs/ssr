import React from 'react';
import loadable from 'react-dynamic-loadable';
import './index.css';
import { store } from "./../store"
import About from "./about"
import Notmatch from "./notmatch"
import Repos from "./repos"
import ReposDetail from "./repos/detail"

const Home = loadable((props) => import("./home"))

// // wrapper of dynamic
const dynamicWrapper = (models, component) => loadable({
  component,
  // LoadingComponent: () => <div>...LOADING...</div>,
  models: () => models.map((m) => {
    return import(`../models/${m}.js`).then((md) => {
      const model = md.default || md;
      const stored = store();
      if (stored && stored.model) {
        stored.model({ name: m, ...model });
      }
    });
  }),
});

export const getRouterData = () => {
  let conf = {
    '/': {
      name: 'page-home',
      element: dynamicWrapper([], () => import(/* webpackChunkName: 'page-home' */ './home')),
    },
    '/about': {
      name: 'page-about',
      element: <About />,
    },
    '/repos': {
      name: 'page-repos',
      element: <Repos />,
      load: Repos.getInitialProps
    },
    '/repos/detail/:id': {
      name: 'page-detail',
      element: <ReposDetail />,
      load: ReposDetail.getInitialProps
    },
    '*': {
      name: 'page-not-match',
      element: <Notmatch />,
    },
    // '/': {
    //   name: 'page-home',
    //   element: dynamicWrapper([], () => import(/* webpackChunkName: 'page-home' */ './home')),
    // },
    // '/about': {
    //   name: 'page-about',
    //   element: dynamicWrapper([], () => import(/* webpackChunkName: 'page-about' */ './about')),
    // },
    // '/repos': {
    //   name: 'page-repos',
    //   element: dynamicWrapper([], () => import(/* webpackChunkName: 'page-repos' */ './repos')),
    // },
    // '/repos/detail/:id': {
    //   name: 'page-detail',
    //   element: dynamicWrapper([], () => import(/* webpackChunkName: 'page-detail' */ './repos/detail')),
    // },
    // '*': {
    //   name: 'page-not-match',
    //   element: dynamicWrapper([], () => import(/* webpackChunkName: 'page-not-match' */ './notmatch')),
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
