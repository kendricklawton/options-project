'use client';

import { ArrowDropDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@mui/icons-material';
import pageStyles from '../page.module.css';
import styles from './page.module.css';
import { IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/app/providers/AppProvider';
import { StyledButton, StyledIconButton, 
  // StyledTextField, 

} from '@/app/components/Styled';
import {
  calculateDaysRemaining, convertUnixTimestamp, convertUnixTimestampTwo, formatDate, formatMarketCap, formatPlusMinus,
  getFilteredOptionChain,
  isNumPositive,
} from '@/app/utils/utils';
import { OptionType } from '@/app/types/types';
import React from 'react';
import { useAuthContext } from '../providers/AuthProvider';

const styledButtonStyles = {
  borderRadius: '0px',
  backgroundColor: 'fff',
  justifyContent: 'space-between',
  minWidth: '6rem',
  whiteSpace: 'nowrap',
};

export default function Home() {
  // App context
  const {
    currentStock,
    currentExpirationDate,
    optionChain,
    expirationDates,
    setCurrentOption,
    setCurrentOptionOrder,
    setCurrentExpirationDate,
    setModalView,
  } = useAppContext();

  // Auth context
  const {
    handleSetInfo,
  } = useAuthContext();

  // State variables
  const [displayStrikes, setDisplayStrikes] = useState<1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40>(1);
  // const [nearInputValue, setNearInputValue] = useState<string>('');
  const [isStrikesMenuOpen, setIsStrikesMenuOpen] = useState(false);
  const [isStrikesMobileMenuOpen, setIsStrikesMobileMenuOpen] = useState(false);
  const [isCallTableOpen, setIsCallTableOpen] = useState(true);
  const [isPutTableOpen, setIsPutTableOpen] = useState(true);
  const [isBottomElementOpen, setIsBottomElementOpen] = useState(true);

  // Refs for DOM elements
  const strikesMenuRef = useRef<HTMLDivElement>(null);
  const strikesMobileMenuRef = useRef<HTMLDivElement>(null);
  const strikesMenuButtonRef = useRef<HTMLButtonElement>(null);
  const strikesMobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const callTableRef = useRef<HTMLDivElement>(null);
  const strikeTableRef = useRef<HTMLDivElement>(null);
  const putTableRef = useRef<HTMLDivElement>(null);

  // Function to handle the display of option analytics
  const handleDisplayOptionAnalytics = (option: OptionType, action?: 'Buy' | 'Sell',) => {
    setCurrentOptionOrder({
      action: action || 'Buy',
      option: option,
      quantity: 10,
    });
    setCurrentOption(option);
    setModalView('analytics');
  };

  // Function to retrieve option chain data for a specific expiration date
  const changeExpirationDate = (date: string) => {
    setCurrentExpirationDate(date);
  };

  // Function to handle the option strategy button
  const handleOptionStrategy = () => {
    handleSetInfo('More Startegies Coming Soon!');
  };

  // Function to toggle the bottom element
  const handleSetIsBottomElementOpen = () => {
    setIsBottomElementOpen(prev => !prev);
  };

  // Function to toggle the call table
  const handleSetIsCallTableOpen = () => {
    if (isCallTableOpen) {
      setIsPutTableOpen(false);
    }
    if (isCallTableOpen && !isPutTableOpen) {
      setIsPutTableOpen(true);
    }
  }

  // Function to toggle the put table
  const handleSetIsPutTableOpen = () => {
    if (isPutTableOpen) {
      setIsCallTableOpen(false);
    }
    if (isPutTableOpen && !isCallTableOpen) {
      setIsCallTableOpen(true);
    }
  }

  // Function to set the total strikes to display
  const handleSetTotalStrikesToDisplay = (value: 1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40) => {
    setDisplayStrikes(value);
    setIsStrikesMenuOpen(false);
    setIsStrikesMobileMenuOpen(false);
  };

  // Function to sync the scroll position of multiple elements
  const syncScroll = (source: HTMLElement, targets: HTMLElement[]) => {
    targets.forEach((target) => {
      if (source !== target) {
        target.scrollTop = source.scrollTop;
      }
    });
  };

  // Function to format the plus/minus sign
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

  // useEffect to sync the scroll position of the three tables
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
  }, [optionChain, isCallTableOpen, isPutTableOpen, callTableRef, strikeTableRef, putTableRef]);

  // useEffect to set the near price input value
  // useEffect(() => {
  //   if (currentStock) {
  //     const nearValue = currentStock?.regularMarketPrice;
  //     if (nearValue) {
  //       setNearInputValue(nearValue.toFixed(2));
  //     }
  //   }
  // }, [currentStock]);

  // useEffect to close the strikes menu when clicking outside
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

  const regularMarketPrice = currentStock?.regularMarketPrice || 0;
  const filteredOptionChain = getFilteredOptionChain(
    optionChain,
    currentExpirationDate,
    displayStrikes,
    regularMarketPrice,
  );

  if (!currentStock) {
    return (
      <div className={pageStyles.page}>
        <div className={pageStyles.wrapper}>
          <h1>Options</h1>
          <h2>Search for a stock symbol to view options</h2>
        </div>
      </div>
    )
  }

  return (
    <div className={pageStyles.page}>
      {/* Details Element */}
      {
        (currentStock != null) && (
          // (filteredOptionChain != null && currentStock != null) && (
          <div className={styles.details}>
            <div className={styles.detailsLeadingColumn}>
              <div className={styles.detailsLeadingTop}>
              <p>{currentStock.symbol?.startsWith('^') ? currentStock.symbol.slice(1).toLocaleUpperCase() : currentStock.symbol?.toLocaleUpperCase() ?? ''}</p>
              <p>|</p>
              <p>{currentStock?.shortName}</p>

              <p className={currentStock?.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                ? currentStock.regularMarketChangePercent > 0
                  ? styles.positive
                  : styles.negative
                : ''
              }>{currentStock?.regularMarketPrice?.toFixed(2)} </p>
              {/* <p>{currentStock.currency}</p> */}
              <p className={currentStock?.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                ? currentStock.regularMarketChangePercent > 0
                  ? styles.positive
                  : styles.negative
                : ''
              }>{formatPlusMinus(currentStock?.regularMarketChange)}</p>
              <p className={currentStock?.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                ? currentStock.regularMarketChangePercent > 0
                  ? styles.positive
                  : styles.negative
                : ''
              }>({formatPlusMinus(currentStock?.regularMarketChangePercent)}%)</p>
              </div>
              <div className={styles.detailsLeadingBottom}>
                  <p>{convertUnixTimestamp(currentStock?.regularMarketTime)}</p>
              </div>
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
        )
      }

      {/* Details Extended Element */}
      {
        (currentStock && isBottomElementOpen) && (
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
              <p>{
                currentStock.marketCap != null && currentStock.marketCap != 0
                  ?
                  formatMarketCap(currentStock.marketCap) : '--'
              }</p>
            </div>
            <div className={styles.elementThTwo}>
              <p>P/E Ratio</p>
              <p>{
                currentStock.forwardPE ?
                  currentStock.forwardPE?.toFixed(2) :
                  '--'
              }</p>
            </div>
            <div className={styles.elementThTwo}>
              <p>Div Yield</p>
              <p>
                {
                  (currentStock.dividendYield != null && currentStock.dividendYield != 0)
                    ? `${(currentStock.dividendYield.toFixed(2))}%`
                    : '--'
                }
              </p>
            </div>
            <div className={styles.elementThTwo}>
              <p>Div Date</p>
              <p>
                {
                  (currentStock.dividendDate)
                    ? convertUnixTimestampTwo(currentStock.dividendDate)
                    : '--'
                }
              </p>
            </div>
            <div className={styles.elementThTwo}>
              <p>52 Week Range</p>
              <p>{currentStock.fiftyTwoWeekRange}</p>
            </div>
          </div>
        )
      }

      {/* Indexes Element */}
      {
        (currentStock?.symbol?.startsWith('^')) && (
          <div className={styles.details}>
            <div className={styles.detailsLeading}>
              <p>{currentStock.symbol?.startsWith('^') ? currentStock.symbol.slice(1) : currentStock.symbol ?? ''} Does Not Offer Options</p>
            </div>
          </div >
        )
      }

      {/* Controls Element */}
      {
        (filteredOptionChain != null) && (
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
                  sx={styledButtonStyles}>{displayStrikes === 1 ? "ALL" : displayStrikes}</StyledButton>
                {
                  isStrikesMenuOpen && (
                    <div className={styles.menu} ref={strikesMenuRef}>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(4)}>4</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(6)}>6</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(8)}>8</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(10)}>10</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(12)}>12</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(16)}>16</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(20)}>20</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(40)}>40</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(1)}>ALL</div>
                      {/* <StyledButtonTwo variant='contained' sx={styledButtonStyles} onClick={() => handleSetTotalStrikesToDisplay(4)}>4</StyledButtonTwo>
                      <StyledButtonTwo variant='contained' sx={styledButtonStyles} onClick={() => handleSetTotalStrikesToDisplay(6)}>6</StyledButtonTwo>
                      <StyledButtonTwo variant='contained' sx={styledButtonStyles} onClick={() => handleSetTotalStrikesToDisplay(8)}>8</StyledButtonTwo>
                      <StyledButtonTwo variant='contained' sx={styledButtonStyles} onClick={() => handleSetTotalStrikesToDisplay(10)}>10</StyledButtonTwo>
                      <StyledButtonTwo variant='contained' sx={styledButtonStyles} onClick={() => handleSetTotalStrikesToDisplay(12)}>12</StyledButtonTwo>
                      <StyledButtonTwo variant='contained' sx={styledButtonStyles} onClick={() => handleSetTotalStrikesToDisplay(16)}>16</StyledButtonTwo>
                      <StyledButtonTwo variant='contained' sx={styledButtonStyles} onClick={() => handleSetTotalStrikesToDisplay(20)}>20</StyledButtonTwo>
                      <StyledButtonTwo variant='contained' sx={styledButtonStyles} onClick={() => handleSetTotalStrikesToDisplay(40)}>40</StyledButtonTwo>
                      <StyledButtonTwo variant='contained' sx={styledButtonStyles} onClick={() => handleSetTotalStrikesToDisplay(1)}>ALL</StyledButtonTwo> */}
                    </div >
                  )}
              </div>
            </div>
            <div className={styles.controlsElementTwo}>
              <p>Near</p>
              <div className={styles.nearInput}>{
                currentStock?.regularMarketPrice?.toFixed(2)
              }</div>
              {/* <p>Near</p>
              <StyledTextField
                id="nearPriceDesktop"
                disabled={true}
                variant="outlined"
                // type='number'
                value={nearInputValue}
                // onChange={(event) => setNearInputValue(Number(event.target.value))}
                sx={{
                  // width: '8.0rem',
                }}
                autoComplete="off"></StyledTextField> */}
            </div>
          </div>
        )
      }

      {/* Controls Mobile Element */}
      {
        (filteredOptionChain != null) && (
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
                  }}>{displayStrikes === 1 ? "ALL" : displayStrikes}</StyledButton>
                {
                  isStrikesMobileMenuOpen && (
                    <div className={styles.menu} ref={strikesMobileMenuRef}>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(4)}>4</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(6)}>6</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(8)}>8</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(10)}>10</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(12)}>12</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(16)}>16</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(20)}>20</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(40)}>40</div>
                      <div className={styles.menuItem} onClick={() => handleSetTotalStrikesToDisplay(1)}>ALL</div>
                    </div >
                  )}
              </div>
            </div>
            <div className={styles.controlsElement}>
              <p>Near</p>
              <div className={styles.nearInput}>{
                currentStock?.regularMarketPrice?.toFixed(2)
                }</div>
              {/* <StyledTextField
                id="nearPriceMobile"
                variant="outlined"
                value={nearInputValue}
                onChange={(event) => handleSetNearInputValue(Number(event.target.value))}
                sx={{ 
                  // width: '5rem' 
                  width: '100%',
                }}
                autoComplete="off">
              </StyledTextField> */}
            </div>
          </div>
        )
      }

      {/* Dates Element */}
      {
        (filteredOptionChain != null) && (
          <div className={styles.dates}>
            {expirationDates.map((date: string, index) => (
              <div className={styles.date} key={index} onClick={
                () => changeExpirationDate(date)
              }>{
                  date == currentExpirationDate
                    ? <CheckOutlined style={{
                      color: 'gray'
                    }} />
                    : null
                }{formatDate(date)}</div>
            ))}
          </div>
        )
      }

      {/* Option Chain Element */}
      {
        (filteredOptionChain != null) && (
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
                {(filteredOptionChain?.calls ?? []).map((data: OptionType, index: React.Key | null | undefined) => (
                  <div key={index} className={
                    (data?.strike && currentStock?.regularMarketPrice ) &&
                      data?.strike < currentStock.regularMarketPrice ? styles.elementsHeaderTdTwo : styles.elementsHeaderTd
                  } onClick={() => handleDisplayOptionAnalytics(data)}>
                    <div className={styles.elementTdLink}><p>{data?.bid ? data.bid.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTd}><p
                      className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : '--'}>
                      {data?.mark ? data.mark.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTdLink}><p>{data?.ask ? data.ask.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.lastPrice ? data.lastPrice.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.change ? formatPlusMinus(data.change) : '--'}</p></div>
                    <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '--'}</p></div>
                    <div className={styles.elementTd}><p>{data?.volume ? data.volume : '--'}</p></div>
                    <div className={styles.elementTd}><p>{data?.impliedVolatility ? `${(data.impliedVolatility * 100).toFixed(2)}%` : '--'}</p></div>
                    <div className={styles.elementTd}><p>{data?.contractSize ? data.contractSize : '--'}</p></div>
                    <div className={styles.elementTd}><p>{data?.openInterest ? data.openInterest : '--'}</p></div>
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
 
              {filteredOptionChain?.strikes && filteredOptionChain.strikes.map((data: number, index: React.Key | null | undefined) => (
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
                {(filteredOptionChain?.puts ?? []).map((data: OptionType, index: React.Key | null | undefined) => (
                  <div key={index} className={
                    (data?.strike && currentStock?.regularMarketPrice) &&
                      data?.strike > currentStock.regularMarketPrice ? styles.elementsHeaderTdTwo : styles.elementsHeaderTd
                  } onClick={() => handleDisplayOptionAnalytics(data)}>
                    <div className={styles.elementTdLink}><p>{data?.bid ? data.bid.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTd}><p
                      className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>
                      {data?.mark ? data.mark.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTdLink}><p>{data?.ask ? data.ask.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.lastPrice ? data.lastPrice.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.change ? formatPlusMinus(data.change) : '--'}</p></div>
                    <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '--'}</p></div>
                    <div className={styles.elementTd}><p>{data?.volume ? data.volume : '--'}</p></div>
                    <div className={styles.elementTd}><p>{data?.impliedVolatility ? `${(data.impliedVolatility * 100).toFixed(2)}%` : '--'}</p></div>
                    <div className={styles.elementTd}><p>{data?.contractSize ? data.contractSize : '--'}</p></div>
                    <div className={styles.elementTd}><p>{data?.openInterest ? data.openInterest : '--'}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }
    </div>
  );
};