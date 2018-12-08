import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './home.module.css';

import Container from '../../components/Container';

export default class Repos extends React.Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { whatever: 'Repos stuff', ...ctx };
  }
  render() {
    return (
      <Container title="This Repos!">
        <Helmet titleTemplate="kkt - %s">
          <title>Repos SSS</title>
        </Helmet>
        <div className={styles.Home}>
          {this.props.whatever}
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
