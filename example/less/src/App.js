import React, { Component } from 'react';
import Button from '@kkt-example/button';
import logo from './logo.svg';
import styles from './App.module.less';
import './App.css';
import './App.less';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <span className={styles.red}>Edit</span> <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div className={styles.btns}>
            <Button type="primary">Primary</Button>
            <Button type="success">Success</Button>
            <Button type="warning">Warning</Button>
            <Button type="danger">Danger</Button>
            <Button type="light">Light</Button>
            <Button type="dark">Dark</Button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
