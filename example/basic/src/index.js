import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';

ReactDOM.hydrate(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
