import path from 'path';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { ServerLocation } from '@reach/router';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import App from './App';

console.log('~~>>>>', process.env.KKT_PUBLIC_DIR);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.KKT_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const extractor = new ChunkExtractor({ statsFile: path.resolve('dist/loadable-stats.json'), entrypoints: ['client'] });
    const html = renderToString(
      <ChunkExtractorManager extractor={extractor}>
        <ServerLocation url={req.url}>
          <App />
        </ServerLocation>
      </ChunkExtractorManager>
    );

    res.status(200).send(`
      <!doctype html>
      <html lang="">
        <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet='utf-8' />
          <title>Welcome to KKT</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${extractor.getLinkTags()}
          ${extractor.getStyleTags()}
        </head>
        <body>
          <div id="root">${html}</div>
          ${extractor.getScriptTags()}
        </body>
      </html>
    `);
  });

export default server;
