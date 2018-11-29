import { matchPath } from 'react-router-dom';

async function isAsyncComponent(Component) {
  return Component.getInitialProps !== undefined;
}


export async function loadInitialProps(routes, pathname, ctx) {
  const promises = [];

  const matchedComponent = Object.keys(routes).find((path) => {
    const match = matchPath(pathname || window.location.pathname, {
      path, exact: routes[path].exact || false, strict: routes[path].strict || false,
    });

    if (match && path && routes[path].component && isAsyncComponent(routes[path].component) && routes[path].component.load) {
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
