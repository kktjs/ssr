import React from 'react';
import express from 'express';
import proxy from 'http-proxy-middleware';
import { renderToString } from 'react-dom/server';
import App from './App';

const assets = require(process.env.KKT_ASSETS_MANIFEST); // eslint-disable-line
const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.KKT_PUBLIC_DIR))
  .use('/api', proxy({ target: 'http://127.0.0.1:3724', changeOrigin: true }))
  .use('/repos/*', proxy({ target: 'https://api.github.com/', changeOrigin: true }))
  .get('/*', (req, res) => {
    const context = {};
    const markup = renderToString(<App />);
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `
<!doctype html>
  <html lang="">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <title>Welcome to KKT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
  </head>
  <body>
    <div id="root">${markup}</div>
    <script src="${assets.client.js}" defer crossorigin></script>
  </body>
</html>`
      );
    }
  });

export default server;
