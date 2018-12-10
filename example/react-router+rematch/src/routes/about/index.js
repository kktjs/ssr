import React from 'react';
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
        <div className="red">
          About <br />
          {this.props.test}
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
