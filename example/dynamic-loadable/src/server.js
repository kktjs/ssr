import React from 'react';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { renderToString } from 'react-dom/server';
import App from './App';
import stats from '../dist/react-loadable.json';

const assets = require(process.env.KKT_ASSETS_MANIFEST); // eslint-disable-line

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.KKT_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const modules = [];
    const markup = renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Loadable.Capture>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      const bundles = getBundles(stats, modules);
      const chunks = bundles.filter(bundle => bundle.file.endsWith('.js')).map((chunk) => {
        if (process.env.NODE_ENV === 'production') {
          return `<script src="/${chunk.file}"></script>`;
        }
        return `<script src="http://${process.env.HOST}:${parseInt(process.env.PORT, 10) + 1}/${chunk.file}"></script>`;
      }).join('\n');
      const styles = bundles.filter(bundle => bundle.file.endsWith('.css'));
      res.status(200).send(`
<!doctype html>
  <html lang="">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <title>Welcome to KKT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
    ${styles.map(style => `<link href="${style.file}" rel="stylesheet" />`).join('\n')}
  </head>
  <body>
    <div id="root">${markup}</div>
    ${process.env.NODE_ENV === 'production' ? `<script src="${assets.client.js}"></script>` : `<script src="${assets.client.js}" crossorigin></script>`}
    ${chunks}
    <script>window.main();</script>
  </body>
</html>`
      );
    }
  });

export default server;
