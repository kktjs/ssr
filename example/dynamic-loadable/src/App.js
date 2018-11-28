import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Loadable from 'react-loadable';

const Home = Loadable({
  loader: () => import('./routes/home'),
  loading: () => null,
});
const About = Loadable({
  loader: () => import('./routes/about'),
  loading: () => null,
});

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
  </Switch>
);

export default App;
