import { hydrate } from 'react-dom';
import App from './app/App';

hydrate(<App />, document.getElementById('root'));
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
}
