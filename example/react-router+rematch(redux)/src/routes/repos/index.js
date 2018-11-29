import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container } from '../../components';
import styles from './home.module.css';

export default class Home extends React.Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    console.log('ctx:', ctx);
    return { whatever: 'stuff' };
  }
  render() {
    return (
      <Container title="This Repos!">
        <Helmet titleTemplate="kkt - %s">
          <title>Home</title>
        </Helmet>
        <div className={styles.Home}>
          <div className={styles.header}>
            <h2>Welcome to Repos</h2>
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
              <a href="https://github.com/jaywcjlove/kkt-ssr">Docs</a>
            </li>
            <li>
              <a href="https://github.com/jaywcjlove/kkt-ssr/issues">Issues</a>
            </li>
          </ul>
        </div>
      </Container>
    );
  }
}
