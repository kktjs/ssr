import React from 'react';
import { Container } from '../../components';
import './index.css';

class User extends React.Component {
  render() {
    return (
      <Container title="User Name">
        <div className="blue">
          This User Home
        </div>
      </Container>
    );
  }
}

export default User;
