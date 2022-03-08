// import React from 'react';
// import loadable from 'react-dynamic-loadable';
// import { store } from '../store';
// import './index.css';
// import Home from "./home"
// import About from "./about"
// import Repos from "./repos"
// import ReposDate from "./repos/detail"
// import Notmatch from "./notmatch"
// // wrapper of dynamic
// const dynamicWrapper = (models, component) => loadable({
//   component,
//   // LoadingComponent: () => <div>...LOADING...</div>,
//   models: () => models.map((m) => {
//     return import(`../models/${m}.js`).then((md) => {
//       const model = md.default || md;
//       const stored = store();
//       if (stored && stored.model) {
//         stored.model({ name: m, ...model });
//       }
//     });
//   }),
// });


// export const getRouterData = () => {
//   let conf = {
//     '/': {
//       name: 'page-home',
//       component: Home,
//       // component: dynamicWrapper(['home'], () => import(/* webpackChunkName: 'page-home' */ './home')),
//       exact: true,
//     },
//     '/about': {
//       name: 'page-about',
//       component: About,
//       // component: dynamicWrapper(['about'], () => import(/* webpackChunkName: 'page-about' */ './about')),
//       exact: true,
//     },
//     '/repos': {
//       name: 'page-repos',
//       component: Repos,
//       // component: dynamicWrapper([], () => import(/* webpackChunkName: 'page-repos' */ './repos')),
//       exact: true,
//     },
//     '/repos/detail/:id': {
//       name: 'page-detail',
//       component: ReposDate,
//       // component: dynamicWrapper([], () => import(/* webpackChunkName: 'page-detail' */ './repos/detail')),
//       exact: true,
//     },
//     '*': {
//       name: 'page-not-match',
//       component: Notmatch,
//       // component: dynamicWrapper([], () => import(/* webpackChunkName: 'page-not-match' */ './notmatch')),
//       exact: true,
//     },
//     // '/:username': {
//     //   file: './username',
//     //   component: dynamicWrapper([], () => import(/* webpackChunkName: 'page-username' */ './username')),
//     //   exact: true,
//     // },
//   };
//   conf = Object.keys(conf).map((path) => {
//     return { ...conf[path], path };
//   });
//   return conf;
// };

// import React from 'react';
import loadable from 'react-dynamic-loadable';
import { store } from '../store';
import './index.css';

// wrapper of dynamic
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
    '/repos/detail/:id': {
      name: 'page-detail',
      component: dynamicWrapper([], () => import(/* webpackChunkName: 'page-detail' */ './repos/detail')),
      exact: true,
    },
    '*': {
      name: 'page-not-match',
      component: dynamicWrapper([], () => import(/* webpackChunkName: 'page-not-match' */ './notmatch')),
      exact: true,
    },
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
