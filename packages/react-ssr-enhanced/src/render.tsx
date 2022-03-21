import url from 'url';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from "react-router-dom/server";
import DefaultDoc from './Document';
import { loadInitialProps } from './loadInitialProps';
import RoutersController from './RoutersController';
import { RenderProps } from "./interface"

export default async (options: RenderProps) => {
  const { req, res, routes, assets, document: Document, customRenderer, renderStatic, store, ...rest } = options;
  const Doc = Document || DefaultDoc;

  // @ts-ignore
  const { match, data } = await loadInitialProps(routes, url.parse(req.url).pathname, { req, res, store, ...rest });

  if (!match) {
    res.status(404);
    return;
  }
  if (match.path === '**') {
    res.status(404);
  } else if (match && match.index && match.path) {
    res.redirect(301, match.path);
    return;
  }
  const renderPage = async () => {
    // By default, we keep ReactDOMServer synchronous renderToString function
    const defaultRenderer = (element: React.ReactElement<any, string | React.JSXElementConstructor<any>>) => ({ html: ReactDOMServer.renderToString(element) });
    const renderer = customRenderer || defaultRenderer;
    // 改路由V6
    const asyncOrSyncRender = renderer(
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <RoutersController store={store} routes={routes} data={data} />
        </StaticRouter>
      </Provider>
    );
    const renderedContent = await asyncOrSyncRender;
    const helmet = await Helmet.renderStatic();
    return { helmet, ...renderedContent };
  };
  // @ts-ignore
  const reactRouterMatch = matchPath(match.path, req.url);
  const { html, ...docProps } = await Doc.getInitialProps({
    req,
    res,
    assets,
    renderPage,
    data,
    store,
    helmet: Helmet.renderStatic(),
    match: reactRouterMatch,
    ...rest,
  });
  // Resolve there is a redirect in getInitialProps.
  if (/^(300|301|302|303|304|305|306|307)/.test(`${res.statusCode}`)) {
    return;
  }

  docProps.preloadAssets = { css: [], js: [] };
  if (reactRouterMatch && reactRouterMatch.pathname && routes) {
    const chunk = routes.find(item => item.path === reactRouterMatch.pathname);
    if (chunk && chunk.name) {
      const chunkAssets = Object.keys(assets).find(item => item === chunk.name);
      Object.keys(assets).forEach((name) => {
        // @ts-ignore
        if (name.indexOf(chunkAssets) > -1) {
          if (assets[name] && assets[name].css) {
            docProps.preloadAssets.css.push(assets[name].css);
          }
          if (assets[name] && assets[name].js) {
            docProps.preloadAssets.js.push(assets[name].js);
          }
        }
      });
    }
  }
  const doc = ReactDOMServer.renderToStaticMarkup(<Doc {...docProps} />);
  return `<!doctype html>${doc.replace('___SERVER_SSR_RENDER___', html)}`;
};
