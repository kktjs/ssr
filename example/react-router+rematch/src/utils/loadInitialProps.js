import { matchPath } from 'react-router-dom';

export async function loadInitialProps(routes, pathname, ctx) {
  const promises = [];
  const matchedComponent = routes.find((route) => {
    const match = matchPath(pathname || window.location.pathname, route);
    if (match && route.component && route.component.getInitialProps !== undefined) {
      const component = route.component;
      promises.push(
        component.load
          ? component.load().then(() => component.getInitialProps({ match, ...ctx }))
          : component.getInitialProps({ match, ...ctx })
      );
    }
    return !!match;
  });
  return {
    match: matchedComponent,
    data: (await Promise.all(promises))[0],
  };
}
