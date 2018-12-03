import { matchPath } from 'react-router-dom';

export async function loadInitialProps(routes, pathname, ctx) {
  const promises = [];

  const matchedComponent = Object.keys(routes).find((path) => {
    const match = matchPath(pathname || window.location.pathname, {
      path, exact: routes[path].exact || false, strict: routes[path].strict || false,
    });
    if (match && path && routes[path] && routes[path].component && routes[path].component.getInitialProps) {
      const component = routes[path].component;
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
