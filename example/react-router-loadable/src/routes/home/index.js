import React from 'react';
import { Link } from 'react-router-dom';
import loadable from '@loadable/component';
import styles from './home.module.css';

const Container = loadable(() => import('../../components/Container'));

class Home extends React.Component {
  render() {
    return (
      <Container title="This About!">
        <p className={styles.intro}>
          To get started, edit <code>src/App.js</code> or{' '}
          <code>src/Home.js</code> and save to reload.
        </p>
        <ul className={styles.resources}>
          <li>
            <Link to="/about/">About</Link>
          </li>
          <li>
            <a href="https://github.com/jaywcjlove/kkt-ssr">Docs</a>
          </li>
          <li>
            <a href="https://github.com/jaywcjlove/kkt-ssr/issues">Issues</a>
          </li>
        </ul>
      </Container>
    );
  }
}

export default Home;
