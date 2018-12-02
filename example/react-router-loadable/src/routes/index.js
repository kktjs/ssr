import React from 'react';
import { Switch } from 'react-router-dom';
import loadable from '@loadable/component';
import './App.css';

const Home = loadable(() => import('./routes/home'));
const About = loadable(() => import('./routes/about'));

const App = () => (
  <Switch>
    <Home exact path="/" />
    <About exact path="/about" />
  </Switch>
);

export default App;
