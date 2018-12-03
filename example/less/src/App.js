import React from 'react';
import styles from './App.module.less';
import './App.css';
import './App.less';

const App = () => (
  <div>
    Welcome <span className="blue">to</span> <span className={styles.red}>KKT</span>.
    <br />
  </div>
);

export default App;
