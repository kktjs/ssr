import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import cookie from 'cookiejs';
import Container from '../../components/Container';
import styles from './home.module.css';

class Home extends React.Component {
  // eslint-disable-next-line
  static async getInitialProps({ req, res, match, store, history, location }) {
    let token = null;
    // only on the server side
    if (req && store.dispatch.global && store.dispatch.global.verify && req.cookies) {
      token = req.cookies.token;
    }
    if (typeof window !== 'undefined') {
      token = cookie.get('token');
    }
    await store.dispatch.global.verify({ token });
    return { whatever: 'Home stuff', isServer: true };
  }
  render() {
    return (
      <Container title="Home">
        <Helmet>
          <title>HomeSSS</title>
        </Helmet>
        <div>
          {this.props.test} <br />
          {this.props.testHome} <br />
          {this.props.whatever ? this.props.whatever : 'loading'}
        </div>
        <ul className={styles.resources}>
          <li>
            <Link to="/about/">About</Link>
          </li>
          <li>
            <a href="https://github.com/kktjs/ssr">Docs</a>
          </li>
          <li>
            <a href="https://github.com/kktjs/ssr/issues">Issues</a>
          </li>
        </ul>
      </Container>
    );
  }
}

const mapState = ({ global, home }) => ({
  test: global.test,
  testHome: home.test,
  name: global.name,
});

const mapDispatch = ({ global }) => ({
  verify: global.verify,
});

export default connect(mapState, mapDispatch)(Home);
