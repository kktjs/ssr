import { matchPath } from 'react-router-dom';
import { RouteNewObject } from "./interface"

export const loadInitialProps = async (routes: RouteNewObject[], pathname: string, ctx: any) => {
  const promises = [];
  const matchedComponent = routes.find((route) => {
    const match = matchPath(route.path, pathname);
    if (match && route.element && route.element.getInitialProps !== undefined) {
      const component = route.element;
      promises.push(
        component.load
          ? component.load().then(() => component.getInitialProps({ match, ...ctx }))
          : component.getInitialProps({ match, ...ctx })
      );
    }
    return !!match;
  });

  return Promise.all(promises).then(data => {
    return ({ data: data[0], match: matchedComponent, })
  })
}

