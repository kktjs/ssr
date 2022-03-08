import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '../../../components/Container';
import './index.css';

export default class Details extends React.Component {
  // eslint-disable-next-line
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { whatever: `This params id: ${match.params.id}. ` };
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
          Repos 2 Details
          <span>{match.params.id}</span>
        </div>
      </Container>
    );
  }
}
