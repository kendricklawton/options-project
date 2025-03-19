'use client';
import styles from './page.module.css';
import React from 'react';

export default function Home() {

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Welcome to Options Project</h1>
        <h2>An easy to use options analytical tool.</h2>
        <h2>Search a symbol to get started.</h2>
      </div>
    </div>
  );
};