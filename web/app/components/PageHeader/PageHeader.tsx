'use client';

import { Add, AddOutlined, ArrowDropDownOutlined, ArrowDropUpOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@mui/icons-material';
import styles from './PageHeader.module.css';
import {
  usePathname,
} from 'next/navigation';
import {
  convertUnixTimestamp, convertUnixTimestampTwo, formatMarketCap, formatPlusMinus,
  isNumPositive,
} from '@/app/utils/utils';
import React from 'react';
// import { useAppContext } from '@/app/providers/AppProvider';
import { useAppStore } from '@/app/stores/useAppStore';

const iconStyles = {
  cursor: 'pointer',
  color: 'grey',
}

const buttonStyles = {
  color: 'white',
  backgroundColor: 'grey',
}

export default function PageHeader() {


  // const { currentStock, subscribedMap, showPageHeaderExt, setShowPageHeaderExt } = useAppContext()
  const { currentStock, subscribedMap, showPageHeaderExt, setShowPageHeaderExt } = useAppStore()
  // State variables
  const pathname = usePathname();

  // Function to toggle the bottom element
  const handleSetIsBottomElementOpen = () => {
    setShowPageHeaderExt(!showPageHeaderExt)
  };

  const indexes = ['^VIX', '^GSPC', '^DJI', '^IXIC', '^RUI', '^RUT', '^RUA'];

  // const indexesMap = new Map<string, string>([
  //   ['^VIX', 'VIX'],
  //   ['^GSPC', 'S&P 500'],
  //   ['^DJI', 'Dow Jones'],
  //   ['^IXIC', 'NASDAQ'],
  //   ['^RUA', 'RUSS 1K'],
  //   ['^RUT', 'RUSS 2K'],
  //   ['RUI', 'RUSS 3K']
  // ]);

  return (
    <div className={styles.wrapper}>
      {
        (pathname === '/') && (
          <div className={styles.marketList}>
            {
              Array.from(subscribedMap.keys())
                .filter((key) => indexes.includes(key))
                .map((key, index) => (
                  <div key={index} className={subscribedMap.get(key)?.info.regularMarketChange === 0 ? styles.market : isNumPositive(subscribedMap.get(key)?.info?.regularMarketChangePercent || 0) ? styles.marketPositive : styles.marketNegative}>
                    <div className={styles.marketElement}>
                      <p>{subscribedMap.get(key)?.info.symbol?.startsWith('^') ? subscribedMap.get(key)?.info.symbol?.slice(1).toLocaleUpperCase() : subscribedMap.get(key)?.info.symbol?.toLocaleUpperCase() ?? ''}</p>
                      <p>{subscribedMap.get(key)?.info?.regularMarketPrice?.toFixed(2)} </p>
                    </div>
                    <div className={styles.marketElementTwo}>
                      {
                        subscribedMap.get(key)?.info?.regularMarketChangePercent === 0
                          ? <ArrowRightOutlined />
                          :
                          isNumPositive(subscribedMap.get(key)?.info?.regularMarketChangePercent || 0)
                            ? <ArrowDropUpOutlined />
                            : <ArrowDropDownOutlined />
                      }
                      <div>
                        <p>{formatPlusMinus(subscribedMap.get(key)?.info?.regularMarketChange)}</p>
                        <p>{formatPlusMinus(subscribedMap.get(key)?.info?.regularMarketChangePercent)}%</p>
                      </div>
                    </div>
                    {/*
                      Market Time Element
                     */}
                    <div className={styles.marketElement}>
                      <p className={styles.marketTime}>{convertUnixTimestamp(subscribedMap.get(key)?.info?.regularMarketTime).toLocaleUpperCase()}</p>
                    </div>
                  </div >
                ))
            }
          </div>
        )
      }

      {
        (pathname !== '/' && currentStock) &&
        (
          <>
            {
              <div className={styles.marketList}>
                <div className={currentStock.info.regularMarketChange === 0 ? styles.market : isNumPositive(currentStock.info?.regularMarketChangePercent || 0) ? styles.marketPositive : styles.marketNegative}>
                  <div className={styles.marketElement}>
                    <p>{currentStock.info.symbol?.startsWith('^') ? currentStock.info.symbol?.slice(1).toLocaleUpperCase() : currentStock.info.symbol?.toLocaleUpperCase() ?? ''}</p>
                    <p>{currentStock.info?.regularMarketPrice?.toFixed(2)} </p>
                  </div>
                  <div className={styles.marketElementTwo}>

                    {
                      currentStock.info?.regularMarketChangePercent === 0
                        ? <ArrowRightOutlined />
                        :
                        isNumPositive(currentStock.info?.regularMarketChangePercent || 0)
                          ? <ArrowDropUpOutlined />
                          : <ArrowDropDownOutlined />
                    }
                    <div>
                      <p>{formatPlusMinus(currentStock.info?.regularMarketChange)}</p>
                      <p>{formatPlusMinus(currentStock.info?.regularMarketChangePercent)}%</p>
                    </div>
                  </div>
                  <div className={styles.marketElement}>
                    <p className={styles.marketTime}>{convertUnixTimestamp(currentStock.info?.regularMarketTime).toLocaleUpperCase()}</p>
                  </div>
                </div>
                <AddOutlined onClick={handleSetIsBottomElementOpen} sx={
                  iconStyles
                } />
                {showPageHeaderExt
                  ?
                  <ArrowDropDownOutlined sx={
                    iconStyles
                  } onClick={handleSetIsBottomElementOpen} />
                  :
                  <ArrowLeftOutlined sx={
                    iconStyles
                  } onClick={handleSetIsBottomElementOpen} />
                }
              </div>
            }
            {
              showPageHeaderExt && (
                <div className={styles.elementExt}>
                  <div>
                    <p>Open</p>
                    <p>{currentStock.info.regularMarketOpen}</p>
                  </div>
                  <div>
                    <p>High</p>
                    <p>{currentStock.info.regularMarketDayHigh}</p>
                  </div>
                  <div>
                    <p>Low</p>
                    <p>{currentStock.info.regularMarketDayLow}</p>
                  </div>
                  <div>
                    <p>Market Cap</p>
                    <p>{
                      currentStock.info.marketCap != null && currentStock.info.marketCap != 0
                        ?
                        formatMarketCap(currentStock.info.marketCap) : '--'
                    }</p>
                  </div>
                  <div>
                    <p>P/E Ratio</p>
                    <p>{
                      currentStock.info.forwardPE ?
                        currentStock.info.forwardPE?.toFixed(2) :
                        '--'
                    }</p>
                  </div>
                  <div>
                    <p>Div Yield</p>
                    <p>
                      {
                        (currentStock.info.dividendYield != null && currentStock.info.dividendYield != 0)
                          ? `${(currentStock?.info?.dividendYield.toFixed(2))}%`
                          : '--'
                      }
                    </p>
                  </div>
                  <div>
                    <p>Div Date</p>
                    <p>
                      {
                        (currentStock.info.dividendDate)
                          ? convertUnixTimestampTwo(currentStock.info.dividendDate)
                          : '--'
                      }
                    </p>
                  </div>
                  <div>
                    <p>52 Week Range</p>
                    <p>{currentStock.info.fiftyTwoWeekRange}</p>
                  </div>
                </div>
              )
            }
          </>)
      }
    </div>
  );
};