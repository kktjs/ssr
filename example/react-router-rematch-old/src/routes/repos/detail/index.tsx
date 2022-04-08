import React from 'react';
import { Helmet } from 'react-helmet';
import { GetInitialProps } from "@kkt/react-ssr-enhanced"
import Container from '../../../components/Container';
import './index.css';

const Details = (props: { whatever?: string }) => {
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
Details.getInitialProps = ({ match }: GetInitialProps) => {
  return { whatever: `This params id: ${match.params.id}. ` };
}
export default Details 