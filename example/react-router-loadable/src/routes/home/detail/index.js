import React from 'react';
import loadable from '@loadable/component';

const Container = loadable(() => import('../../../components/Container'));

export default class Detail extends React.Component {
  render() {
    return (
      <Container title={`This Detail! ${this.props.computedMatch.params.id}`}>
        <div className="blue">
          Detail
        </div>
      </Container>
    );
  }
}
