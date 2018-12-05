import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './routes/home';
import About from './routes/about';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
  </Switch>
);

export default App;
