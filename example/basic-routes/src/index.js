import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes';
import { BrowserRouter } from "react-router-dom";

const renderMethod = !!module.hot ? ReactDOM.render : ReactDOM.hydrate

renderMethod(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
