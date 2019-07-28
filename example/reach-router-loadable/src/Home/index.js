import React from 'react';
import { Link } from '@reach/router';
import loadable from '@loadable/component';
import './Home.css';

const Intro = loadable(() => import('./Intro'));
const Welcome = loadable(() => import('./Welcome'));
const Logo = loadable(() => import('./Logo'));

const Home = () => (
  <div className="Home">
    <div className="Home-header">
      <Logo />
      <Welcome />
    </div>
    <Intro />
    <ul className="Home-resources">
      <li>
        <Link to="/about/">About</Link>
      </li>
      <li>
        <a href="https://github.com/kktjs/kkt-ssr">Docs</a>
      </li>
      <li>
        <a href="https://github.com/kktjs/kkt-ssr/issues">Issues</a>
      </li>
    </ul>
  </div>
);

export default Home;
