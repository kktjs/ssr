import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import Path from 'path';
import FS from 'fs';

import App from './routes';

// require 方式 打包报错
const assetsMainifest = new Function(`return ${FS.readFileSync(`${OUTPUT_PUBLIC_PATH}/asset-client-manifest.json`, "utf-8")}`)()

const assets = {}

if (assetsMainifest && assetsMainifest["entrypoints"]) {
  Object.values(assetsMainifest.entrypoints).forEach((item) => {
    if (/.css$/.test(item)) {
      assets.css = item
    }
    if (/.js$/.test(item)) {
      assets.js = item
    }
  })
}

const appDirectory = FS.realpathSync(process.cwd());
const resolveApp = (relativePath) => Path.resolve(appDirectory, relativePath);
const server = express();
// server.use(express.static(resolveApp("dist")))



const render = (props = {}) => {
  const html = renderToString(
    <StaticRouter location={props.url}>
      <App {...props} />
    </StaticRouter>
  );
  return html;
};

server
  .disable('x-powered-by')
  .use(express.static(resolveApp('dist')))
  .get('/*', (req, res) => {
    let urls = req.url
    if (urls === "/") {
      urls = "/home"
    }
    const context = {};
    const markup = render({ url: urls });
    if (req.url === "/") {
      res.redirect("/home");
    } else {
      res.status(200).send(`
<!doctype html>
  <html lang="">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <title>Welcome to KKT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${assets.css ? `<link rel="stylesheet" href="${assets.css}">` : ''}
  </head>
  <body>
    <div id="root">${markup}</div>
   ${assets.js ? `<script src="${assets.js}" defer crossorigin></script>` : ""} 
  </body>
</html>`);
    }
  });

export default server;
