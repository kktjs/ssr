import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom"
import App from './routes';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
