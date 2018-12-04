import React from 'react';
import styles from './App.module.styl';
import './App.css';
import './App.styl';

const App = () => (
  <div>
    Welcome <span className="blue">to</span> <span className={styles.red}>KKT</span>.
    <br />
  </div>
);

export default App;
