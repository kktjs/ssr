import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Container } from '../../components';
import styles from './home.module.css';

class Home extends React.Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { whatever: 'Home stuff', ...ctx };
  }
  componentDidMount() {
    this.props.verify();
  }
  render() {
    return (
      <Container title="Welcome to KKT, This Home!">
        <Helmet titleTemplate="kkt - %s">
          <title>Home</title>
        </Helmet>
        <div>
          {this.props.test} <br />
          {this.props.testHome} <br />
          {this.props.whatever} <br />
          {this.props.whatever} <br />
          {this.props.whatever} <br />
          {this.props.whatever} <br />
        </div>
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

const mapState = ({ global, home }) => ({
  test: global.test,
  testHome: home.test,
});

const mapDispatch = ({ global }) => ({
  verify: global.verify,
});

export default connect(mapState, mapDispatch)(Home);

