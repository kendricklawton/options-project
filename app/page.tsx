'use client';

import { ArrowDropDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@mui/icons-material';
import styles from './page.module.css';
import { IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/app/providers/AppProvider';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { StyledButton, StyledButtonTwo, StyledIconButton, StyledTextField } from '@/app/components/Styled';
import { calculateDaysRemaining, convertUnixTimestamp, convertUnixTimestampTwo, formatDate, formatMarketCap, formatPlusMinus, isNumPositive } from '@/app/utils/utils';
import { OptionType } from '@/app/types/types';
import React from 'react';

const menuButtonStyle = {
  borderRadius: '0px',
  borderTop: 'none',
  borderBottom: 'none',
  border: 'none',
  justifyContent: 'flex-start',
  width: '6rem',
}

export default function Home() {
  const {
    currentExpirationDate,
    currentNearPrice,
    currentStock,
    optionChain,
    optionExpirationDates,
    totalStrikesToDisplay,
    fetchStockData,
    setCurrentOption,
    setCurrentOptionOrder,
    setModalView } = useAppContext();
  const { setInfo } = useAuthContext();

  const [nearPriceInputValue, setNearInputValue] = useState('');
  const [isStrikesMenuOpen, setIsStrikesMenuOpen] = useState(false);
  const [isStrikesMobileMenuOpen, setIsStrikesMobileMenuOpen] = useState(false);
  const [isCallTableOpen, setIsCallTableOpen] = useState(true);
  const [isPutTableOpen, setIsPutTableOpen] = useState(true);
  const [isBottomElementOpen, setIsBottomElementOpen] = useState(false);

  const strikesMenuRef = useRef<HTMLDivElement>(null);
  const strikesMenuButtonRef = useRef<HTMLButtonElement>(null);
  const strikesMobileMenuRef = useRef<HTMLDivElement>(null);
  const strikesMobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Refs for the three scrollable elements
  const callTableRef = useRef<HTMLDivElement>(null);
  const strikeTableRef = useRef<HTMLDivElement>(null);
  const putTableRef = useRef<HTMLDivElement>(null);

  // const handleAddToWatchList = () => {
  //   console.log('Add to watch list');
  // };

  const handleDisplayOptionAnalytics = (option: OptionType, action?: 'Buy' | 'Sell',) => {
      setCurrentOptionOrder({
        action: action || 'Buy',
        option: option,
        quantity: 10,
      });
    setCurrentOption(option);
    setModalView('analytics');
  };

  const handleFetchExpirationDate = async (expirationDate: string) => {
    if (expirationDate == currentExpirationDate) return;
    if (currentStock?.symbol == null) return;
    const symbol = currentStock.symbol;
    try {
      await fetchStockData(symbol, expirationDate);
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleOptionStrategy = () => {
    setInfo('More Startegies Coming Soon!');
  };

  const handleSetIsBottomElementOpen = () => {
    setIsBottomElementOpen(prev => !prev);
  };

  const handleSetIsCallTableOpen = () => {
    if (isCallTableOpen) {
      setIsPutTableOpen(false);
    }
    if (isCallTableOpen && !isPutTableOpen) {
      setIsPutTableOpen(true);
    }
  }

  const handleSetIsPutTableOpen = () => {
    if (isPutTableOpen) {
      setIsCallTableOpen(false);
    }
    if (isPutTableOpen && !isCallTableOpen) {
      setIsCallTableOpen(true);
    }
  }

  const handleSetTotalStrikesToDisplay = async (totalStrikes: 1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40) => {
    console.log('totalStrikes', totalStrikes);
    if (totalStrikes == totalStrikesToDisplay) return;
    if (currentStock?.symbol == null) return;
    const symbol = currentStock.symbol;
    const expirationDate = currentExpirationDate;
    try {
      await fetchStockData(symbol, expirationDate, undefined, totalStrikes);
      setIsStrikesMenuOpen(false);
      setIsStrikesMobileMenuOpen(false);
    }
    catch (error) {
      console.error(error);
    }
  };

  // Function to sync the scroll position of multiple elements
  const syncScroll = (source: HTMLElement, targets: HTMLElement[]) => {
    targets.forEach((target) => {
      if (source !== target) {
        target.scrollTop = source.scrollTop;
      }
    });
  };

  const ElementsHeaderTh = () => {
    return (
      <div className={styles.elementsHeaderTh}>
        <div className={styles.elementTh}><p>Bid</p></div>
        <div className={styles.elementTh}><p>Mark</p></div>
        <div className={styles.elementTh}><p>Ask</p></div>
        <div className={styles.elementTh}><p>Last</p></div>
        <div className={styles.elementTh}><p>Change</p></div>
        <div className={styles.elementTh}><p>Change</p><p>Percent</p></div>
        <div className={styles.elementTh}><p>Volume</p></div>
        <div className={styles.elementTh}><p>Implied</p><p>Volatility</p></div>
        <div className={styles.elementTh}><p>Contart</p><p>Size</p></div>
        <div className={styles.elementTh}><p>Open</p><p>Interest</p></div>
      </div>
    )
  }

  useEffect(() => {
    const callTable = callTableRef.current;
    const strikeTable = strikeTableRef.current;
    const putTable = putTableRef.current;
    if (callTable && strikeTable && putTable) {
      const handleScroll = (source: HTMLElement) => {
        syncScroll(source, [callTable, strikeTable, putTable]);
      };

      callTable.addEventListener('scroll', () => handleScroll(callTable));
      strikeTable.addEventListener('scroll', () => handleScroll(strikeTable));
      putTable.addEventListener('scroll', () => handleScroll(putTable));

      return () => {
        callTable.removeEventListener('scroll', () => handleScroll(callTable));
        strikeTable.removeEventListener('scroll', () => handleScroll(strikeTable));
        putTable.removeEventListener('scroll', () => handleScroll(putTable));
      };
    }
  }, [optionChain, isCallTableOpen, isPutTableOpen]);

  useEffect(() => {
    setNearInputValue(currentNearPrice?.toFixed(2) || '');
  }, [currentNearPrice]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (strikesMenuRef.current && !strikesMenuRef.current.contains(event.target as Node)) {
        if (!strikesMenuButtonRef.current?.contains(event.target as Node)) {
          setIsStrikesMenuOpen(false);
        }
      }

      if (strikesMobileMenuRef.current && !strikesMobileMenuRef.current.contains(event.target as Node)) {
        if (!strikesMobileMenuButtonRef.current?.contains(event.target as Node)) {
          setIsStrikesMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (currentStock == null) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1>Welcome to Options Project</h1>
          <h2>An easy to use options analytical tool.</h2>
          <h2>Search a symbol to get started.</h2>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.page}>
      {/* Details Element */}
      {currentStock && (
        <>
          <div className={styles.details}>
            <div className={styles.detailsLeading}>
              <p>{currentStock.symbol?.toLocaleUpperCase()}</p> |
              <p>{currentStock.shortName?.toLocaleUpperCase()}</p>
              {/* <StyledIconButton onClick={handleAddToWatchList} size='small'>
                <PlaylistAdd />
              </StyledIconButton> */}
            </div>
          </div >
          <div className={styles.details}>
            <div className={styles.detailsLeading}>
              <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                ? currentStock.regularMarketChangePercent > 0
                  ? styles.positive
                  : styles.negative
                : ''
              }>{currentStock.regularMarketPrice?.toFixed(2)} </p>
              {/* <p>{currentStock.currency}</p> */}
              <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                ? currentStock.regularMarketChangePercent > 0
                  ? styles.positive
                  : styles.negative
                : ''
              }>{formatPlusMinus(currentStock.regularMarketChange)}</p>
              <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                ? currentStock.regularMarketChangePercent > 0
                  ? styles.positive
                  : styles.negative
                : ''
              }>({formatPlusMinus(currentStock.regularMarketChangePercent)}%)</p>
              <p>{convertUnixTimestamp(currentStock.regularMarketTime)}</p>
            </div>
            <div className={styles.detailsTrailing}>
              <StyledIconButton onClick={handleSetIsBottomElementOpen} size='small'>
                {isBottomElementOpen
                  ?
                  <ArrowDropDownOutlined />
                  :
                  <ArrowLeftOutlined />
                }
              </StyledIconButton>
            </div>
          </div >
        </>
      )}
      {/* Details Extended Element */}
      {(isBottomElementOpen && currentStock) && (
        <div className={styles.detailsExt}>
          <div className={styles.elementThTwo}>
            <p>Open</p>
            <p>{currentStock.regularMarketOpen}</p>
          </div>
          <div className={styles.elementThTwo}>
            <p>High</p>
            <p>{currentStock.regularMarketDayHigh}</p>
          </div>
          <div className={styles.elementThTwo}>
            <p>Low</p>
            <p>{currentStock.regularMarketDayLow}</p>
          </div>
          <div className={styles.elementThTwo}>
            <p>Market Cap</p>
            <p>{formatMarketCap(currentStock.marketCap)}</p>
          </div>
          <div className={styles.elementThTwo}>
            <p>P/E Ratio</p>
            <p>{
              currentStock.forwardPE ?
                currentStock.forwardPE?.toFixed(2) :
                'N/A'
            }</p>
          </div>
          <div className={styles.elementThTwo}>
            <p>Div Yield</p>
            <p>
              {
                (currentStock.dividendYield != null && currentStock.dividendYield != 0)
                  ? `${(currentStock.dividendYield).toFixed(2)}%`
                  : '0.00%'
              }
            </p>
          </div>
          <div className={styles.elementThTwo}>
            <p>Div Date</p>
            <p>
              {
                (currentStock.dividendDate)
                  ? convertUnixTimestampTwo(currentStock.dividendDate)
                  : 'N/A'
              }
            </p>
          </div>
          <div className={styles.elementThTwo}>
            <p>52 Week Range</p>
            <p>{currentStock.fiftyTwoWeekRange}</p>
          </div>
        </div>
      )}

      {/* Controls Element */}
      <div className={styles.controls}>
        <div className={styles.controlsElement}>
          <p>Strategies</p>
          <StyledButton variant="contained"
            onClick={handleOptionStrategy}
            endIcon={<ArrowDropDownOutlined />}
            sx={{
              borderRadius: '0px',
              width: 'fit-content',
              whiteSpace:
                'nowrap',
            }}>CALL / PUT</StyledButton>
        </div>
        <div className={styles.controlsElementTwo}>
          <p>Strikes</p>
          <div className={styles.anchor}>
            <StyledButton variant="contained"
              onClick={() => setIsStrikesMenuOpen(prev => !prev)}
              endIcon={<ArrowDropDownOutlined />}
              ref={strikesMenuButtonRef}
              sx={{
                borderRadius: '0px',
                backgroundColor: 'fff',
                justifyContent: 'space-between',
                minWidth: '6rem',
                whiteSpace: 'nowrap',
              }}>{totalStrikesToDisplay === 1 ? "ALL" : totalStrikesToDisplay}</StyledButton>
            {
              isStrikesMenuOpen && (
                <div className={styles.menu} ref={strikesMenuRef}>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(4)}>4</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(6)}>6</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(8)}>8</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(10)}>10</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(12)}>12</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(16)}>16</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(20)}>20</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(40)}>40</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(1)}>ALL</StyledButtonTwo>
                </div >
              )}
          </div>
        </div>
        <div className={styles.controlsElementTwo}>
          <p>Near</p>
          <StyledTextField
            id="nearPrice"
            variant="outlined"
            value={nearPriceInputValue}
            onChange={(event) => setNearInputValue(event.target.value)}
            sx={{
              width: '5rem',
            }}
            autoComplete="off"></StyledTextField>
        </div>
      </div>

      {/* Controls Mobile Element */}
      <div className={styles.controlsMobile}>
        <div className={styles.controlsElement}>
          <p>Strikes</p>
          <div className={styles.anchor}>
            <StyledButton variant="contained"
              onClick={() => setIsStrikesMobileMenuOpen(prev => !prev)}
              endIcon={<ArrowDropDownOutlined />}
              ref={strikesMobileMenuButtonRef}
              sx={{
                borderRadius: '0px',
                backgroundColor: 'fff',
                justifyContent: 'space-between',
                minWidth: '6rem',
                whiteSpace: 'nowrap',
              }}>{totalStrikesToDisplay === 1 ? "ALL" : totalStrikesToDisplay}</StyledButton>
            {
              isStrikesMobileMenuOpen && (
                <div className={styles.menu} ref={strikesMobileMenuRef}>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(4)}>4</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(6)}>6</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(8)}>8</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(10)}>10</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(12)}>12</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(16)}>16</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(20)}>20</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(40)}>40</StyledButtonTwo>
                  <StyledButtonTwo variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(1)}>ALL</StyledButtonTwo>
                </div >
              )}
          </div>
        </div>
        <div className={styles.controlsElement}>
          <p>Near</p>
          <StyledTextField
            id="nearPrice"
            variant="outlined"
            value={nearPriceInputValue}
            onChange={(event) => setNearInputValue(event.target.value)}
            sx={{ width: '5rem' }}
            autoComplete="off">
          </StyledTextField>
        </div>
      </div>

      {/* Dates Element */}
      <div className={styles.dates}>
        {optionExpirationDates.map((date: string, index) => (
          <div className={styles.date} key={index} onClick={() => handleFetchExpirationDate(date)}>{
            date == currentExpirationDate
              ? <CheckOutlined style={{
                color: 'gray'
              }} />
              : null
          }{formatDate(date)}</div>
        ))}
      </div>

      {/* Option Chain Element */}
      <div className={styles.optionChainWrapper}>
        {/* Calls Table */}
        {isCallTableOpen && (
          <div className={styles.tableCalls} ref={callTableRef}>
            <div className={styles.tableHeaderCalls}>
              <div>
                {
                  !isPutTableOpen &&
                  (<IconButton size='small' onClick={handleSetIsCallTableOpen}>
                    <ArrowLeftOutlined sx={{
                      color: 'gray'
                    }} />
                  </IconButton>)
                }
                <p>Calls</p>
                {
                  isPutTableOpen && (
                    <IconButton size='small' onClick={handleSetIsCallTableOpen}>
                      <ArrowRightOutlined sx={{
                        color: 'gray'
                      }} />
                    </IconButton>)
                }
              </div>
            </div>
            <ElementsHeaderTh />
            {optionChain?.calls.map((data: OptionType, index: React.Key | null | undefined) => (
              <div key={index} className={
                (data?.strike && currentNearPrice) &&
                  data?.strike < currentNearPrice ? styles.elementsHeaderTdTwo : styles.elementsHeaderTd
              } onClick={() => handleDisplayOptionAnalytics(data)}>
                <div className={styles.elementTdLink}><p>{data?.bid ? data.bid.toFixed(2) : '0.00'}</p></div>
                <div className={styles.elementTd}><p
                  className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>
                  {data?.mark ? data.mark.toFixed(2) : '0.00'}</p></div>
                <div className={styles.elementTdLink}><p>{data?.ask ? data.ask.toFixed(2) : '0.00'}</p></div>
                <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.lastPrice ? data.lastPrice.toFixed(2) : '0.00'}</p></div>
                <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.change ? formatPlusMinus(data.change) : '0.00'}</p></div>
                <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '0.00%'}</p></div>
                <div className={styles.elementTd}><p>{data?.volume ? data.volume : '0'}</p></div>
                <div className={styles.elementTd}><p>{data?.impliedVolatility ? `${(data.impliedVolatility * 100).toFixed(2)}%` : '0.00%'}</p></div>
                <div className={styles.elementTd}><p>{data?.contractSize ? data.contractSize : 'N/A'}</p></div>
                <div className={styles.elementTd}><p>{data?.openInterest ? data.openInterest : '0'}</p></div>
                {/* <div className={styles.elementTd}><p>{data?.strike ? data.strike : '0'}</p></div> */}
              </div>
            ))}
          </div>
        )}

        {/* Strikes Table */}
        <div className={styles.tableStrikes} ref={strikeTableRef}>
          <div className={styles.tableHeaderStrikes}>
            <p>Strikes</p>
          </div>
          <div className={styles.elementsHeaderThStrikes}>
            <div className={styles.elementThStrikes}><p>{formatDate(currentExpirationDate)}</p><p>({calculateDaysRemaining(currentExpirationDate)} days)</p></div>
          </div>
          {optionChain?.strikes.map((data: number, index: React.Key | null | undefined) => (
            <div key={index} className={styles.elementsHeaderTdStrikes}>
              <div className={styles.elementTdStrikes}><p>{data.toString()}</p></div>
            </div>
          ))}
        </div>

        {/* Puts Table */}
        {isPutTableOpen && (
          <div className={styles.tablePuts} ref={putTableRef}>
            <div className={styles.tableHeaderPuts}>
              <div>
                {
                  isCallTableOpen &&
                  (<IconButton size='small' onClick={handleSetIsPutTableOpen}>
                    <ArrowLeftOutlined sx={{
                      color: 'gray'
                    }} />
                  </IconButton>)
                }
                <p>Puts</p>
                {
                  !isCallTableOpen && (
                    <IconButton size='small' onClick={handleSetIsPutTableOpen}>
                      <ArrowRightOutlined sx={{
                        color: 'gray'
                      }} />
                    </IconButton>)
                }
              </div>
            </div>
            <ElementsHeaderTh />
            {optionChain?.puts.map((data: OptionType, index: React.Key | null | undefined) => (
              <div key={index} className={
                (data?.strike && currentNearPrice) &&
                  data?.strike > currentNearPrice ? styles.elementsHeaderTdTwo : styles.elementsHeaderTd
              } onClick={() => handleDisplayOptionAnalytics(data)}>
                <div className={styles.elementTdLink}><p>{data?.bid ? data.bid.toFixed(2) : '0.00'}</p></div>
                <div className={styles.elementTd}><p
                  className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>
                  {data?.mark ? data.mark.toFixed(2) : '0.00'}</p></div>
                <div className={styles.elementTdLink}><p>{data?.ask ? data.ask.toFixed(2) : '0.00'}</p></div>
                <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.lastPrice ? data.lastPrice.toFixed(2) : '0.00'}</p></div>
                <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.change ? formatPlusMinus(data.change) : '0.00'}</p></div>
                <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '0.00%'}</p></div>
                <div className={styles.elementTd}><p>{data?.volume ? data.volume : '0'}</p></div>
                <div className={styles.elementTd}><p>{data?.impliedVolatility ? `${(data.impliedVolatility * 100).toFixed(2)}%` : '0.00%'}</p></div>
                <div className={styles.elementTd}><p>{data?.contractSize ? data.contractSize : 'N/A'}</p></div>
                <div className={styles.elementTd}><p>{data?.openInterest ? data.openInterest : '0'}</p></div>
                {/* <div className={styles.elementTd}><p>{data?.strike ? data.strike : '0'}</p></div> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};