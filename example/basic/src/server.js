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
      const htmlStr = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to KKT SSR</title>
</head>
  <body>
    <div id="root">${markup}</div>
  </body>
</html>
`;
      res.status(200).send(htmlStr);
    }
  });

export default server;
