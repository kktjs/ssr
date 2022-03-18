import { matchPath } from 'react-router-dom';
import { RouteNewObject } from "./interface"

export const loadInitialProps = async (routes: RouteNewObject[], pathname: string, ctx: any) => {

  const promises: Promise<any>[] = [];

  const matchedComponent = routes.find((route) => {
    const match = matchPath(route.path as string, pathname);
    const component = route.element;
    if (route.path && match && component) {
      if (component.getInitialProps && typeof component.getInitialProps === "function") {
        // @ts-ignore
        const resule = component.load ? component.load().then(() => component.getInitialProps({ match, ...ctx })) : component.getInitialProps({ match, ...ctx })
        promises.push(resule);
      }
    }
    return !!match;
  });

  return Promise.all(promises).then(data => {
    return ({ data: data[0], match: matchedComponent, })
  })
}

