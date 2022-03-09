import { matchPath } from 'react-router-dom';
import { RouteNewObject } from "./interface"

export async function loadInitialProps(routes: RouteNewObject[], pathname: string, ctx: any) {
  const promises = [];
  // 改路由V6
  const matchedComponent = routes.find((route) => {
    const match = matchPath(route.path, pathname || window.location.pathname);
    if (match && route.element && route.element.getInitialProps !== undefined) {
      const component = route.element;
      if (route.load) {
        promises.push(route.load({ match, ...ctx }));
      } else {
        const pros = component.load
          ? component.load().then(() => component.getInitialProps({ match, ...ctx }))
          : component.getInitialProps({ match, ...ctx })
        promises.push(pros);
      }
    }
    return !!match;
  });
  return {
    match: matchedComponent,
    data: promises.length && (await Promise.all(promises))[0] || {},
  };
}
