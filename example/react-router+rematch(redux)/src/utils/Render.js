import url from 'url';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { matchPath, StaticRouter } from 'react-router-dom';
import { Document as DefaultDoc } from './Document';
import RoutersController from './RoutersController';
import { loadInitialProps } from './loadInitialProps';
import loadableAssets from '../../dist/loadable-assets.json';

const modPageFn = function (Page) {
  return props => <Page {...props} />;
};

export default async (options) => {
  const { req, res, routes, assets, document: Document, customRenderer, ...rest } = options;
  const Doc = Document || DefaultDoc;
  const context = {};

  const { match, data } = await loadInitialProps(routes, url.parse(req.url).pathname, {
    req,
    res,
    ...rest,
  });

  const renderPage = async (fn = modPageFn) => {
    // By default, we keep ReactDOMServer synchronous renderToString function
    const defaultRenderer = element => ({ html: ReactDOMServer.renderToString(element) });
    const renderer = customRenderer || defaultRenderer;
    const asyncOrSyncRender = await renderer(
      <StaticRouter location={req.url} context={context}>
        {fn(RoutersController)({
          routes,
          data,
        })}
      </StaticRouter>
    );

    const renderedContent = await asyncOrSyncRender;
    const helmet = Helmet.renderStatic();
    return { helmet, ...renderedContent };
  };


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
  // The server loads the js/css resources as needed.
  assets.loadable = {
    css: [], js: [],
  };
  if (routes && routes[match] && routes[match].file) {
    if (loadableAssets[routes[match].file]) {
      assets.loadable.css = loadableAssets[routes[match].file].filter(item => /.css$/.test(item.publicPath));
      assets.loadable.js = loadableAssets[routes[match].file].filter(item => /.js$/.test(item.publicPath));

      assets.loadable.css = assets.loadable.css.map(item => item.publicPath);
      assets.loadable.js = assets.loadable.js.map(item => item.publicPath);
    }
  }

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

  const doc = ReactDOMServer.renderToStaticMarkup(<Doc {...docProps} />);
  return `<!doctype html>${doc.replace('___SERVER_SSR_RENDER___', html)}`;
};
