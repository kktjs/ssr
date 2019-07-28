import React from 'react';
import { Link } from 'react-router-dom';
import logo from './react.svg';
import styles from './home.module.css';

class Home extends React.Component {
  render() {
    return (
      <div className={styles.Home}>
        <div className={styles.header}>
          <img src={logo} className={styles.logo} alt="logo" />
          <h2>Welcome to KKT</h2>
        </div>
        <p className={styles.intro}>
          To get started, edit <code>src/App.js</code> or{' '}
          <code>src/Home.js</code> and save to reload.
        </p>
        <ul className={styles.resources}>
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
  }
}

export default Home;
