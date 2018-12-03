import React from 'react';
import styled from 'styled-components';

const Title = styled.div`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const Description = styled.p`
  font-size: 12px;
  text-align: center;
`;

const App = () => (
  <div>
    <Title>Welcome to KKT.</Title>
    <Description>Hello World, this is my first styled component! </Description>
  </div>
);

export default App;
