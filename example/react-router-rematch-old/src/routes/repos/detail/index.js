import React from 'react';
import { Helmet } from 'react-helmet';
import Container from '../../../components/Container';
import './index.css';

const Details = (props) => {
  return (
    <Container title={`Repos Details`}>
      <Helmet titleTemplate="%s - kkt">
        <title>Repos Details</title>
      </Helmet>
      <div className="blue">
        {props.whatever}
        Repos 2 Details
        {/* <span>{match.params.id}</span> */}
      </div>
    </Container>
  );
}
Details.getInitialProps = ({ req, res, history, location, match, ...ctx }) => {
  return { whatever: `This params id: ${match.params.id}. ` };
}
export default Details 