import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.module.styl';
import './App.css';
import './App.styl';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <span className={styles.red}>KKT</span>
        </header>
      </div>
    );
  }
}
