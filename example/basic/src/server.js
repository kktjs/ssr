import express from 'express';
import { renderToString } from 'react-dom/server';
import App from './App';

const jsScriptTagsFromChunks = (assets, extra = '') => {
  return assets.js.map((asset) => `<script src="${asset}" ${extra}></script>`).join('');
};

const assets = require(KKT_ASSETS_MANIFEST);
const chunks = require(KKT_CHUNKS);
console.log('KKT_ASSETS_MANIFEST?', KKT_ASSETS_MANIFEST);
console.log('KKT_CHUNKS?', KKT_CHUNKS);
console.log('KKT_SSR_CLIENT_PORT?', KKT_SSR_CLIENT_PORT);
console.log('KKT_SSR_SERVER_PORT?', KKT_SSR_SERVER_PORT);
console.log('assets?', assets);
console.log('chunks?', chunks);
const server = express();
server
  .disable('x-powered-by')
  // .use(express.static(KKT_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // 'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With,' + (req.header('access-control-request-headers') || ''),
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      `Content-Type, X-Requested-With, ${req.header('access-control-request-headers') || ''}`,
    );
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    const context = {};
    const markup = renderToString(<App />);
    if (context.url) {
      res.redirect(context.url);
    } else {
      const htmlStr = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to KKTs SSR</title>
</head>
  <body>
    <div id="root">${markup}</div>
    ${jsScriptTagsFromChunks(chunks.main, 'defer crossorigin')}
  </body>
</html>
`;
      res.status(200).send(htmlStr);
    }
  });

export default server;
