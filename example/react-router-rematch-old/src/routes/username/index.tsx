import React from 'react';
import './index.css';
import Container from "../../components/Container"

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
