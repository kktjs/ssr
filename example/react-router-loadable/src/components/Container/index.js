import React from 'react';
import logo from './react.svg';
import styles from './index.module.css';
import './index.css';

export default class Container extends React.Component {
  render() {
    const { title } = this.props;
    return (
      <div className={styles.Home}>
        <div className={styles.header}>
          <img src={logo} className={styles.logo} alt="logo" />
          <h2 className={styles.title}>{title}</h2>
        </div>
        {this.props.children}
      </div>
    );
  }
}
