import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from '../../../components';
import './index.css';

class Details extends React.Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { whatever: `This params id: ${match.params.id}. `, ...ctx };
  }
  render() {
    const { match } = this.props;
    return (
      <Container title={`Repos Details ${match.params.id}`}>
        <Helmet titleTemplate="%s - kkt">
          <title>Repos Details</title>
        </Helmet>
        <div className="blue">
          {this.props.whatever}
          Repos Details
          <span>{match.params.id}</span>
        </div>
      </Container>
    );
  }
}

export default Details;
