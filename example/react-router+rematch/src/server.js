import React from 'react';
import express from 'express';
import cookieParser from 'cookie-parser';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import proxy from 'http-proxy-middleware';
import render from '@kkt/react-ssr-enhanced/render';
import RoutersController from '@kkt/react-ssr-enhanced/RoutersController';
import { getRouterData } from './routes';
import { createStore } from './store';

const assets = require(process.env.KKT_ASSETS_MANIFEST); // eslint-disable-line
const routes = getRouterData();
const server = express();

function renderStatic({ location, context, data, store }) {
  return (
    <Provider store={store}>
      <StaticRouter location={location} context={context}>
        <RoutersController store={store} routes={routes} data={data} />
      </StaticRouter>
    </Provider>
  );
}

server.disable('x-powered-by');
// API request to pass cookies
// `getInitialProps` gets the required value via `req.cookies.token`
server.use(cookieParser());
server.use(express.static(process.env.KKT_PUBLIC_DIR));
server.use('/api', proxy({
  target: `http://${process.env.HOST}:3724`,
  changeOrigin: true,
}));
server.get('/*', async (req, res) => {
  const store = await createStore();
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
