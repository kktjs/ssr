import { matchPath } from 'react-router-dom';
import { RouteNewObject } from "./interface"

export const loadInitialProps = async (routes: RouteNewObject[], pathname: string, ctx: any) => {

  const getMatch = (route: RouteNewObject) => {
    return matchPath(route.path, pathname)
  }

  const currentMatch = routes.filter((route) => {
    if (matchPath(route.path, pathname)) {
      return (route.element && route.element.name === "AsyncRouteComponent") || route.load
    }
    return false
  }).map((item) => {
    if (item.load) {
      return item.load({ match: getMatch(item), ...ctx })
    }
    if (item.element.getInitialProps) {
      return item.element.getInitialProps({ match: getMatch(item), ...ctx })
    }
  });

  const current = routes.find((route) => !!matchPath(route.path, pathname))

  return Promise.all(currentMatch).then(data => {
    return ({ data: data[0], match: current, })
  })
}

