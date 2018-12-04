import React from 'react';
import { Switch, Link } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import './index.css';

// To avoid flashing a loader if the loading is very fast, you could implement a minimum delay.
// There is no built-in API in `@loadable/component` but you could do it using [`p-min-delay`](https://github.com/sindresorhus/p-min-delay).
const Home = loadable(() => pMinDelay(import('./home')), 2000);
const About = loadable(() => pMinDelay(import('./about')), 2000);
const Contcat = loadable(() => pMinDelay(import('./contcat')), 2000);
const Detail = loadable(() => pMinDelay(import('./home/detail')), 2000);

const App = () => (
  <React.Fragment>
    <div className="menu">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contcat">Contcat</Link>
      <Link to="/detail/123">Detail</Link>
    </div>
    <Switch>
      <Home exact path="/" />
      <About exact path="/about" />
      <Contcat exact path="/contcat" />
      <Detail path="/detail/:id" />
    </Switch>
  </React.Fragment>
);

export default App;
