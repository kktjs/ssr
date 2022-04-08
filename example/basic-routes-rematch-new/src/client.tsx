
import React from 'react';
import ReactDOM from 'react-dom';
import App from './routes';
import { BrowserRouter } from "react-router-dom";
import store from "./models"
import { Provider } from 'react-redux';

ReactDOM.hydrate(
  <Provider store={store} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'));
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
}
