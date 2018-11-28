import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import App from './App';

const root = document.getElementById('root');
function render(Root) {
  Loadable.preloadReady().then(() => {
    hydrate(
      <BrowserRouter>
        <Root />
      </BrowserRouter>,
      root,
    );
  });
}

window.main = () => {
  render(App);
};

if (module.hot) {
  module.hot.accept('./App', () => {
    const NewApp = require('./App').default; // eslint-disable-line
    render(NewApp);
  });
}
