import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ensureReady from '@kkt/react-ssr-enhanced/ensureReady';
import RoutersController from '@kkt/react-ssr-enhanced/RoutersController';
import history from './utils/history';
import { getRouterData } from './routes';
import { createStore } from './store';

const routes = getRouterData();

(async () => {
  // Initialize store
  const store = await createStore(window._KKT_STORE);
  ensureReady(routes).then(async (data) => {
    // Fix: Expected server HTML to contain a matching <a> in
    // Warning: render(): Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17.
    // Replace the ReactDOM.render() call with ReactDOM.hydrate() if you want React to attach to the server HTML.
    // const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate; // eslint-disable-line
    const renderMethod = ReactDOM.hydrate; // eslint-disable-line
    // The server renders an error and is mounted on the Window object.
    // The object exists only on the client side.
    window._history = history;
    renderMethod(
      <Provider store={store}>
        <Router history={history}>
          <RoutersController store={store} routes={routes} data={data} />
        </Router>
      </Provider>,
      document.getElementById('root')
    );
  });
})();

if (module.hot) {
  module.hot.accept();
}
