import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { loadableReady } from '@loadable/component';
import { hydrate } from 'react-dom';
import App from './routes';


loadableReady(() => {
  hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  );
});

if (module.hot) {
  module.hot.accept();
}
