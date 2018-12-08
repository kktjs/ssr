import React from 'react';
import { Subscribe, Container } from 'unstated';
import './App.css';

class CounterContainer extends Container {
  state = {
    count: 0,
  };

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  decrement() {
    this.setState({ count: this.state.count - 1 });
  }
}

function Counter() {
  return (
    <Subscribe to={[CounterContainer]}>
      {counter => (
        <div>
          <h1>This Unstated Example</h1>
          <button type="button" onClick={() => counter.decrement()}>-</button>
          <span>{counter.state.count}</span>
          <button type="button" onClick={() => counter.increment()}>+</button>
        </div>
      )}
    </Subscribe>
  );
}

export default Counter;
