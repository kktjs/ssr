import url from 'url';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { matchPath } from 'react-router-dom';
import { Document as DefaultDoc } from './Document';
import { loadInitialProps } from './loadInitialProps';

export default async (options) => {
  const { req, res, routes, assets, document: Document, customRenderer, renderStatic, ...rest } = options;
  const Doc = Document || DefaultDoc;
  const context = {};

  const { match, data } = await loadInitialProps(routes, url.parse(req.url).pathname, { req, res, ...rest });

  if (!match) {
    res.status(404);
    return;
  }
  if (match.path === '**') {
    res.status(404);
  } else if (match && match.redirectTo && match.path) {
    res.redirect(301, req.originalUrl.replace(match.path, match.redirectTo));
    return;
  }
  const renderPage = async () => {
    // By default, we keep ReactDOMServer synchronous renderToString function
    const defaultRenderer = element => ({ html: ReactDOMServer.renderToString(element) });
    const renderer = customRenderer || defaultRenderer;
    const asyncOrSyncRender = await renderer(renderStatic({ location: req.url, context, data }));
    const renderedContent = await asyncOrSyncRender;
    const helmet = await Helmet.renderStatic();
    return { helmet, ...renderedContent };
  };
  const reactRouterMatch = matchPath(req.url, match);
  const { html, ...docProps } = await Doc.getInitialProps({
    req,
    res,
    assets,
    renderPage,
    data,
    helmet: Helmet.renderStatic(),
    match: reactRouterMatch,
    ...rest,
  });
  if (reactRouterMatch.path && routes[reactRouterMatch.path]) {
    const name = routes[reactRouterMatch.path].name;
    docProps.preloadAssets = { css: [], js: [] };
    Object.keys(assets).forEach((chunkName) => {
      if (chunkName.indexOf(name) > -1) {
        if (assets[chunkName].css) docProps.preloadAssets.css.push(assets[chunkName].css);
        if (assets[chunkName].js) docProps.preloadAssets.js.push(assets[chunkName].js);
      }
    });
  }
  const doc = ReactDOMServer.renderToStaticMarkup(<Doc {...docProps} />);
  return `<!doctype html>${doc.replace('___SERVER_SSR_RENDER___', html)}`;
};
