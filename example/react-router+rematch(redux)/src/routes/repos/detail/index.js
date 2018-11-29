import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container } from '../../../components';
import './index.css';

class Details extends React.Component {
  render() {
    return (
      <Container title="Details">
        <Helmet titleTemplate="kkt - %s">
          <title>Home</title>
        </Helmet>
        <div className="blue">
          Details <Link to="/">Home</Link> <Link to="/repos">Repos</Link>
        </div>
      </Container>
    );
  }
}

export default Details;
