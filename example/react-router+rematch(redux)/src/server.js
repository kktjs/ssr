import React from 'react';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import render from './utils/Render';
import routes from './routes';
import RoutersController from './utils/RoutersController';
import store from './store';

const assets = require(process.env.KKT_ASSETS_MANIFEST); // eslint-disable-line
const server = express();

const modPageFn = function (Page) {
  return props => <Page {...props} />;
};

function renderStatic({ location, context, data }) {
  return (
    <Provider store={store}>
      <StaticRouter location={location} context={context}>
        {modPageFn(RoutersController)({
          routes,
          data,
        })}
      </StaticRouter>
    </Provider>
  );
}

server.disable('x-powered-by');
server.use(express.static(process.env.KKT_PUBLIC_DIR));
server.get('/*', async (req, res) => {
  try {
    const html = await render({
      req,
      res,
      routes,
      assets,
      renderStatic,
      // Anything else you add here will be made available
      // within getInitialProps(ctx)
      // e.g a redux store...
      customThing: 'thing',
    });
    res.send(html);
  } catch (error) {
    res.json(error);
  }
});

export default server;
