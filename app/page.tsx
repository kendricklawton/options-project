'use client';
import pageStyles from './page.module.css';
import React from 'react';

export default function Home() {
  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHeader}>
        <h1>Options Project</h1>
        <h2>An easy to use options analytical tool.</h2>
        <h2>Search a symbol to get started.</h2>
      </div>
    </div>
  );
};