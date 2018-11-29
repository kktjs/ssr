import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import RoutersController from './utils/RoutersController';
import routes from './routes';
import { ensureReady } from './utils/ensureReady';
import './client.css';

ensureReady(routes).then((data) => {
  hydrate(
    <BrowserRouter>
      <RoutersController data={data} routes={routes} />
    </BrowserRouter>,
    document.getElementById('root')
  );
});

if (module.hot) {
  module.hot.accept();
}
