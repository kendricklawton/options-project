'use client';
import styles from './page.module.css';
import React from 'react';
import { useAppContext } from './providers/AppProvider';
import { ArrowDropDownOutlined } from '@mui/icons-material';
import { convertUnixTimestamp, formatPlusMinus, isNumPositive } from './utils/utils';
// import { ArrowDropDownOutlined } from '@mui/icons-material';

export default function Home() {
  const { subscribedMap } = useAppContext();

  const symbols = ['^VIX', '^GSPC', '^DJI', '^IXIC'];

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.marketsWrapper}>
          <div className={styles.marketsList}>
            {
              subscribedMap.size > 0 && (
                <div className={styles.marketsList}>
                  {
                    Array.from(subscribedMap.keys())
                      .filter((key) => symbols.includes(key)) // Only include keys that match the symbols array
                      .map((key, index) => (
                        <div
                          key={index}
                          className={
                            subscribedMap.get(key)?.info.regularMarketChangePercent === 0
                              ? styles.market
                              : isNumPositive(subscribedMap.get(key)?.info.regularMarketChangePercent || 0)
                                ? styles.marketPositive
                                : styles.marketNegative
                          }
                        >
                          <div>
                            <p>{key}</p>
                            <p>{subscribedMap.get(key)?.info?.regularMarketPrice}</p>
                          </div>
                          <div>
                            <ArrowDropDownOutlined />
                            <p>
                              {`${formatPlusMinus(subscribedMap.get(key)?.info?.regularMarketChange)} `}
                              {`(${formatPlusMinus(subscribedMap.get(key)?.info?.regularMarketChangePercent)}%)`}
                            </p>
                          </div>
                          <div>
                            <p>{convertUnixTimestamp(subscribedMap.get(key)?.info?.regularMarketTime)}</p>
                          </div>
                        </div>
                      ))
                  }
                </div>
              )
            }
          </div>
        </div>

        <div className={styles.content}>
          <h1>Options Project</h1>
          <h2>Less is more. Lets focus on options.</h2>
          <h2>Search a symbol to get started.</h2>
        </div>
      </div>
    </div>
  );
}