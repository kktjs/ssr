import React from 'react';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import proxy from 'http-proxy-middleware';
import render from './utils/Render';
import { getRouterData } from './routes';
import RoutersController from './utils/RoutersController';
import createStore, { store } from './store';

const assets = require(process.env.KKT_ASSETS_MANIFEST); // eslint-disable-line

const routes = getRouterData();
const server = express();

function renderStatic({ location, context, data }) {
  createStore(store.getState());
  return (
    <Provider store={store}>
      <StaticRouter location={location} context={context}>
        <RoutersController store={store} routes={routes} data={data} />
      </StaticRouter>
    </Provider>
  );
}

server.disable('x-powered-by');
server.use(express.static(process.env.KKT_PUBLIC_DIR));
server.use('/api', proxy({
  target: 'http://127.0.0.1:3724',
  changeOrigin: true,
}));
server.get('/*', async (req, res) => {
  try {
    const html = await render({
      req,
      res,
      routes,
      assets,
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
