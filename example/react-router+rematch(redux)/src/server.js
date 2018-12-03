import React from 'react';
import path from 'path';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import proxy from 'http-proxy-middleware';
import render from './utils/Render';
import routes from './routes';
import RoutersController from './utils/RoutersController';
import createStore, { store } from './store';

const server = express();
const modPageFn = (Page) => {
  return props => <Page {...props} />;
};

function renderStatic({ location, context, data, extractor }) {
  createStore(store.getState());
  return (
    <Provider store={store}>
      <ChunkExtractorManager extractor={extractor}>
        <StaticRouter location={location} context={context}>
          {modPageFn(RoutersController)({
            routes,
            data,
          })}
        </StaticRouter>
      </ChunkExtractorManager>
    </Provider>
  );
}

server.disable('x-powered-by');
server.use(express.static(process.env.KKT_PUBLIC_DIR));
server.use('/api', proxy({ target: 'http://127.0.0.1:3724', changeOrigin: true }));
server.get('/*', async (req, res) => {
  const extractor = new ChunkExtractor({ statsFile: path.resolve('dist/loadable-stats.json'), entrypoints: ['client'] });
  try {
    const html = await render({
      req,
      res,
      routes,
      extractor,
      renderStatic,
      store, // This Redux
    });
    res.send(html);
  } catch (error) {
    // eslint-disable-next-line
    console.log('html---server--error>>>>:', error);
    res.json(error);
  }
});

export default server;
