import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import App from './app/App';

import Path from 'path';
import FS from 'fs';
const appDirectory = FS.realpathSync(process.cwd());
const resolveApp = (relativePath) => Path.resolve(appDirectory, relativePath);
const server = express();
server
  .disable('x-powered-by')
  .use(express.static(resolveApp('dist')))
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
    <link rel="stylesheet" href="server.css">
  </head>
  <body>
    <div id="root">${markup}</div>
  </body>
</html>`,
      );
    }
  });

export default server;
