import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import Path from 'path';
import FS from 'fs';
import { Provider } from 'react-redux';
import store from "./models"
import App from './routes';


const assetsMainifest = new Function(`return ${FS.readFileSync(`${OUTPUT_PUBLIC_PATH}/asset-client-manifest.json`, "utf-8")}`)()


const appDirectory = FS.realpathSync(process.cwd());
const resolveApp = (relativePath) => Path.resolve(appDirectory, relativePath);
const server = express();
// server.use(express.static(resolveApp("dist")))

const render = (props = {}) => {
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={props.url}>
        <App {...props} />
      </StaticRouter>
    </Provider>
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
   ${assetsMainifest.client.css ? `<link rel="stylesheet" href="${assetsMainifest.client.css}">` : ''}
  </head>
  <body>
    <div id="root">${markup}</div>
   ${assetsMainifest.client.js ? `<script src="${assetsMainifest.client.js}" defer crossorigin></script>` : ""}
  </body>
</html>`);
    }
  });

export default server;
