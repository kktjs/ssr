import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import loadable from '@loadable/component';
import './App.css';

const Home = loadable(() => import('./routes/home'));
const About = loadable(() => import('./routes/about'));

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
  </Switch>
);

export default App;
