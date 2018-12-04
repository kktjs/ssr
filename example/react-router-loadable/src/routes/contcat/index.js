import React from 'react';
import loadable from '@loadable/component';

const Container = loadable(() => import('../../components/Container'));

class Contcat extends React.Component {
  render() {
    return (
      <Container title="This Contcat!">
        <div className="blue">
          Contcat
        </div>
      </Container>
    );
  }
}

export default Contcat;


// import React from 'react';

// const Contcat = () => (<div>Contcat page</div>);
// export default Contcat;
