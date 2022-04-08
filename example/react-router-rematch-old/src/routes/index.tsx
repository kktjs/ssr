import React from 'react';
import loadable from 'react-dynamic-loadable';
// import './index.css';
import { store } from "./../store"
import About from "./about"
import Home from "./home"
import Notmatch from "./notmatch"
import Repos from "./repos"
import ReposDetail from "./repos/detail"

// wrapper of dynamic
const dynamicWrapper = (models: string[], component: () => Promise<typeof import("./home")>) => loadable({
  component,
  LoadingComponent: () => <div>...LOADING...</div>,
  models: () => models.map((m) => {
    return import(`../models/${m}.js`).then((md) => {
      const model = md.default || md;
      const stored = store();
      if (stored && stored.model) {
        stored.addModel({ name: m, ...model });
      }
    });
  }),
});

export const getRouterData = () => {
  let conf: Record<string, object> = {
    '/': {
      name: 'page-home',
      // element: <Home />
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
  };
  const list = Object.keys(conf).map((path) => {
    return { ...conf[path], path };
  });
  return list;
};
