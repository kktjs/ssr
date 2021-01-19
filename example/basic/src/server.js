import express from 'express';
import { renderToString } from 'react-dom/server';
import App from './App';

const assets = require(KKT_ASSETS_MANIFEST);
console.log('KKT_ASSETS_MANIFEST?', KKT_ASSETS_MANIFEST);
console.log('assets?', assets);
const server = express();
server
  .disable('x-powered-by')
  // .use(express.static(KKT_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const markup = renderToString(<App />);
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to KKT4 SSR</title>
</head>
    <body>
      <div id="root">${markup}</div>
    </body>
</html>`,
      );
    }
  });

export default server;

// <head>
// <meta http-equiv="X-UA-Compatible" content="IE=edge" />
// <meta charset="utf-8" />
// <title>Welcome to KKT2</title>
// <meta name="viewport" content="width=device-width, initial-scale=1">
// ${
//   assets.client.css
//     ? `<link rel="stylesheet" href="${assets.client.css}">`
//     : ''
// }
// ${
//   process.env.NODE_ENV === 'production'
//     ? `<script src="${assets.client.js}" defer></script>`
//     : `<script src="${assets.client.js}" defer crossorigin></script>`
// }
// </head>
