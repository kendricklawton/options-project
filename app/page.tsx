'use client';
import styles from './page.module.css';
import React from 'react';
import { useAppContext } from './providers/AppProvider';
import { ArrowDropDownOutlined, ArrowDropUpOutlined, ArrowRightOutlined } from '@mui/icons-material';
import { convertUnixTimestamp, formatPlusMinus, isNumPositive } from './utils/utils';
// import { ArrowDropDownOutlined } from '@mui/icons-material';

export default function Home() {
  const { subscribedMap } = useAppContext();

  const symbols = ['^VIX', '^GSPC', '^DJI', '^IXIC'];
  const symbolsMap = new Map<string, string>([
    ['^VIX', 'VIX'],
    ['^GSPC', 'S&P 500'],
    ['^DJI', 'Dow Jones'],
    ['^IXIC', 'NASDAQ'],
  ]);

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
                            <p>{symbolsMap.get(key)}</p>
                            <p>{subscribedMap.get(key)?.info?.regularMarketPrice}</p>
                          </div>
                          <div>
                            {
                              subscribedMap.get(key)?.info.regularMarketChangePercent === 0
                                ? <ArrowRightOutlined />
                                : 
                                isNumPositive(subscribedMap.get(key)?.info.regularMarketChangePercent || 0)
                                  ? <ArrowDropUpOutlined />
                                  : <ArrowDropDownOutlined />
                            }
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

        <h1>Options Project</h1>
        <h2>Less is more. Lets focus on options.</h2>
        <h2>Search a symbol to get started.</h2>
      </div>
    </div>
  );
}