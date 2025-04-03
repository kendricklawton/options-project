'use client';
import pageStyles from './page.module.css';
import React from 'react';

export default function Home() {
  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.wrapper}>
        <h1>Options Project</h1>
        <h2>Less is more. Lets focus on options.</h2>
        <h2>Search a symbol to get started.</h2>
      </div>

      {/* <div className={pageStyles.pageContent}>
        <div className={pageStyles.pageContentContainer}>
          <div className={pageStyles.pageContentElement}>
            <h2>Markets</h2>
          </div>
          <div className={pageStyles.pageContentElement}>
            <p>Top Gainers</p>
          </div>
          <div className={pageStyles.pageContentElement}>
            <p>Top Losers</p>
          </div>
          <div className={pageStyles.pageContentElement}>
            <p>Market Events</p>
          </div>
          <div className={pageStyles.pageContentElement}>
            <p>Most Active</p>
          </div>
        </div>

        <div className={pageStyles.pageContentContainer}>
          <div className={pageStyles.pageContentElement}>
            <h2>News</h2>
          </div>
          <div className={pageStyles.pageContentElement}>
            <p>Top Gainers</p>
          </div>
          <div className={pageStyles.pageContentElement}>
            <p>Top Losers</p>
          </div>
          <div className={pageStyles.pageContentElement}>
            <p>Market Events</p>
          </div>
          <div className={pageStyles.pageContentElement}>
            <p>Most Active</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};