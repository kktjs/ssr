import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
// import styles from './index.module.less';
const styles = {}

export default function NotMatch() {
  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>Page not found</title>
      </Helmet>
      <h1>404</h1>
      <div className={styles.title}>
        Page not found
      </div>
      <div className={styles.des}>
        This is not the web page you are looking for
      </div>
      <div className={styles.btn}>
        <Link to="/">Back Home</Link>
      </div>
    </div>
  );
}
