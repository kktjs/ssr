import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Container from '../../components/Container';
import './index.css';

class About extends React.Component {
  render() {
    return (
      <Container title="About">
        <Helmet>
          <title>AboutSSS</title>
        </Helmet>
        <div className="yellow">
          About <Link to="/">Home</Link> <Link to="/repos">Repos</Link>
        </div>
      </Container>
    );
  }
}

const mapState = ({ about }) => ({
  test: about.test,
});

const mapDispatch = ({ global }) => ({
  verify: global.verify,
});

export default connect(mapState, mapDispatch)(About);
