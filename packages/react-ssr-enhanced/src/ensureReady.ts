import { matchPath } from 'react-router-dom';
import { RouteNewObject } from "./interface"

export default async function ensureReady(routes: RouteNewObject[], pathname: string) {

  await Promise.all(
    routes.map((route) => {
      const match = matchPath(route.path, pathname || window.location.pathname);
      if (match && route && route.element && route.element.load) {
        return route.element.load();
      }
      return undefined;
    })
  );

  let data: unknown;
  // eslint-disable-next-line
  if (typeof window !== undefined && !!document) {
    // @ts-ignore
    data = window._KKT_SSR;
  }
  return Promise.resolve(data || {});
}
