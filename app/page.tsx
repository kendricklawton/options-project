'use client';
import styles from './page.module.css';
import React from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { useAppContext } from './providers/AppProvider';
// import { formatPlusMinus, isNumPositive } from './utils/utils';

export default function Home() {

  // const router = useRouter();
  // const pathname = usePathname();

  // const {
  //    popularList,
  //    fetchData } = useAppContext();

  // const handleFetchStockDataIndex = async (symbol: string) => {
  //   try {
  //     await fetchData(false, symbol);
  //     if (pathname === '/') {
  //       router.push('/options');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Welcome to Options Project</h1>
        <h2>An easy to use options analytical tool.</h2>
        <h2>Search a symbol to get started.</h2>
        {/* <h2>Popular Stocks {popularList.length === 0 && ('Loading...')}</h2>
        <div className={styles.stockListWrapper}>
          <div className={styles.stockList}>
            {
              popularList.map((data, index) => (
                <div className={styles.stock} key={index} onClick={() => handleFetchStockDataIndex(
                  data?.symbol ? data?.symbol : ''
                )}>

                  <p className={styles.symbol}>{data.symbol}</p>
                  <p className={isNumPositive(data.regularMarketChangePercent ? data.regularMarketChangePercent : 0) ? styles.positive : styles.negative} >
                    {data.regularMarketPrice?.toFixed(2)}</p>
                  {
                    data.regularMarketPrice && (
                      <p className={isNumPositive(data.regularMarketChangePercent ? data.regularMarketChangePercent : 0) ? styles.positive : styles.negative} >
                        {`${formatPlusMinus(data.regularMarketChange)}`}
                      </p>
                    )
                  }
                  <p className={isNumPositive(data.regularMarketChangePercent ? data.regularMarketChangePercent : 0) ? styles.positive : styles.negative} >
                    {`(${formatPlusMinus(data.regularMarketChangePercent)})%`}
                  </p>
                </div>
              ))
            }
          </div>
        </div> */}
      </div>
    </div>
  );
};