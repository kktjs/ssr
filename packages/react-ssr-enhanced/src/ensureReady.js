import { matchPath } from 'react-router-dom';

export default async function ensureReady(routes, pathname) {
  await Promise.all(
    routes.map((route) => {
      const match = matchPath(pathname || window.location.pathname, route);
      if (match && route && route.component && route.component.load) {
        return route.component.load();
      }
      return undefined;
    })
  );

  let data;
  // eslint-disable-next-line
  if (typeof window !== undefined && !!document) {
    data = window._KKT_SSR;
  }
  return Promise.resolve(data);
}
