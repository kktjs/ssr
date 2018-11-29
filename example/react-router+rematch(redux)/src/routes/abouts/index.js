import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container } from '../../components';
import './index.css';

class About extends React.Component {
  render() {
    return (
      <Container title="About">
        <Helmet>
          <title>About</title>
        </Helmet>
        <div className="blue">
          About <Link to="/">Home</Link> <Link to="/repos">Repos</Link>
        </div>
      </Container>
    );
  }
}

export default About;
