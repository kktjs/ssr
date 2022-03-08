import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes';

ReactDOM.hydrate(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
