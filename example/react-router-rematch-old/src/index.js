import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ensureReady, RoutersController } from '@kkt/react-ssr-enhanced';
import history from './utils/history';
import { getRouterData } from './routes';
import stores from './models';

const routes = getRouterData();
(async () => {
  // Initialize store
  ensureReady(routes).then(async (data) => {
    // Fix: Expected server HTML to contain a matching <a> in
    // Warning: render(): Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17.
    // Replace the ReactDOM.render() call with ReactDOM.hydrate() if you want React to attach to the server HTML.
    // const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate; // eslint-disable-line
    const renderMethod = !!module.hot ? ReactDOM.render : ReactDOM.hydrate; // eslint-disable-line
    // The server renders an error and is mounted on the Window object.
    // The object exists only on the client side.
    window._history = history;
    renderMethod(
      <Provider store={stores}>
        <BrowserRouter  >
          <RoutersController store={stores} routes={routes} data={data} history={history} />
        </BrowserRouter>
      </Provider>,
      document.getElementById('root')
    );
  });
})();

if (module.hot) {
  module.hot.accept();
}
