import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import ReactDOM from 'react-dom';
import RoutersController from './utils/RoutersController';
import routes from './routes';
import { ensureReady } from './utils/ensureReady';
import './client.css';

ensureReady(routes).then((data) => {
  // Fix: Expected server HTML to contain a matching <a> in
  // Warning: render(): Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17.
  // Replace the ReactDOM.render() call with ReactDOM.hydrate() if you want React to attach to the server HTML.
  const renderMethod = !!module.hot ? ReactDOM.render : ReactDOM.hydrate; // eslint-disable-line
  renderMethod(
    <BrowserRouter>
      <RoutersController data={data} routes={routes} />
    </BrowserRouter>,
    document.getElementById('root')
  );
});

if (module.hot) {
  module.hot.accept();
}
