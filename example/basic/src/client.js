import React from 'react';
import { hydrate, render } from 'react-dom';
import App from './App';

const renderMethod = module.hot ? render : hydrate;

renderMethod(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
