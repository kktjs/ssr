import React from 'react';
import { Link } from 'react-router-dom';
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
          <div className={styles.menus}>
            <Link to="/">Home</Link>
            <Link to="/about/">About</Link>
            <Link to="/repos">Repos</Link>
            <Link to="/repos/detail/123?id=34334">Repos Detail</Link>
            <Link to="/repos/dets">No Match</Link>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
