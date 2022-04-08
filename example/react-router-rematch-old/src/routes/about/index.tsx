import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Container from '../../components/Container';
import './index.css';
import { RootState, Dispatch } from "./../../models"
class About extends React.Component<{ test: string }> {
  render() {
    return (
      <Container title="About">
        <Helmet>
          <title>AboutSSS</title>
        </Helmet>
        <div className="red">
          About <br />
          {this.props.test}
        </div>
      </Container>
    );
  }
}

const mapState = ({ about }: RootState) => ({
  test: about.test,
});

const mapDispatch = ({ global }: Dispatch) => ({
  verify: global.verify,
});

export default connect(mapState, mapDispatch)(About);
