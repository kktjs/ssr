import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import RoutersController from './utils/RoutersController';
import routes from './routes';
import { ensureReady } from './utils/ensureReady';
import createStore, { store } from './store';

const modPageFn = (Page) => {
  return props => <Page {...props} />;
};

ensureReady(routes).then((data) => {
  // Fix: Expected server HTML to contain a matching <a> in
  // Warning: render(): Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17.
  // Replace the ReactDOM.render() call with ReactDOM.hydrate() if you want React to attach to the server HTML.
  // const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate; // eslint-disable-line
  const renderMethod = ReactDOM.render; // eslint-disable-line
  createStore(window._KKT_STORE);
  // const storeData = createStore(store.getState());
  // console.log('data:!!!', data, store);
  // const renderMethod = ReactDOM.hydrate; // eslint-disable-line
  renderMethod(
    <Provider store={store}>
      <BrowserRouter>
        {modPageFn(RoutersController)({
          routes,
          data,
        })}
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
});

if (module.hot) {
  module.hot.accept();
}
