import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom"
// import { BrowserRouter } from "react-router"
import App from './routes/index';

ReactDOM.hydrate(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
}
