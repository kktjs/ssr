import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'unstated';
import App from './App';

hydrate(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
