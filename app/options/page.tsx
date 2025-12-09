'use client';

import { ArrowDropDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@mui/icons-material';
import pageStyles from '../page.module.css';
import styles from './page.module.css';
import { useState, useRef, useEffect } from 'react';
// import { useAppContext } from '@/app/providers/AppProvider';
import { useAppStore } from '@/app/stores/useAppStore';
import {
  StyledButton,
  // StyledTextField, 

} from '@/app/components/Styled';
import {
  calculateDaysRemaining, formatDate, formatPlusMinus,
  getFilteredOptionChain,
  isNumPositive,
} from '@/app/utils/utils';
import { OptionType } from '@/app/types/types';
import React from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import PageHeader from '../components/PageHeader/PageHeader';

const buttonStyles = {
  color: 'white',
  backgroundColor: 'grey',
  justifyContent: 'space-between',
  minWidth: '6rem',
}

export default function Home() {
  // App context
  // const {
  //   currentExpirationDate,
  //   currentExpirationDates,
  //   currentStock,
  //   setCurrentExpirationDate,
  //   setCurrentOptionOrder,
  // } = useAppContext();

  const {
    currentExpirationDate,
    currentExpirationDates,
    currentStock,
    setCurrentExpirationDate,
    setCurrentOptionOrder,
    setModalView
  } = useAppStore();

  const { handleSetInfo } = useAuthContext();

  // State variables

  const [displayStrikes, setDisplayStrikes] = useState<1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40>(1);
  const [filteredOptionChain, setFilteredOptionChain] = useState<{
    calls: OptionType[];
    puts: OptionType[];
    strikes: number[];
  }>();
  // const [nearInputValue, setNearInputValue] = useState<string>('');
  const [isStrikesMenuOpen, setIsStrikesMenuOpen] = useState(false);
  const [isStrikesMobileMenuOpen, setIsStrikesMobileMenuOpen] = useState(false);
  const [isCallTableOpen, setIsCallTableOpen] = useState(true);
  const [isPutTableOpen, setIsPutTableOpen] = useState(true);

  // Refs for DOM elements
  const strikesMenuRef = useRef<HTMLDivElement>(null);
  const strikesMobileMenuRef = useRef<HTMLDivElement>(null);
  const strikesMenuButtonRef = useRef<HTMLButtonElement>(null);
  const strikesMobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const callTableRef = useRef<HTMLDivElement>(null);
  const strikeTableRef = useRef<HTMLDivElement>(null);
  const putTableRef = useRef<HTMLDivElement>(null);


  // Function to handle the display of option analytics
  const handleDisplayOptionAnalytics = (option: OptionType, action?: 'buy' | 'sell') => {
    console.log('Selected Option: ', option.contractSymbol);
    console.log('Current Expiration Date: ', currentExpirationDate);
    if (option.contractSymbol && currentExpirationDate) {
      setCurrentOptionOrder(
        {
          action: action ?? 'buy',
          option: option,
          orderType: undefined,
          strikes: currentStock?.optionChain[currentExpirationDate]?.strikes,
        }
      )
      setModalView('snapshot');
    }
    // else {
    //   handleSetInfo('Contract N/A');
    // }
  };

  // Function to retrieve option chain data for a specific expiration date
  const changeExpirationDate = (date: string) => {
    setCurrentExpirationDate(date);
  };

  // Function to handle the option strategy button
  const handleOptionStrategy = () => {
    handleSetInfo('More strategies coming soon!');
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
    // console.log('Syncing scroll position');
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
  }, [filteredOptionChain, isCallTableOpen, isPutTableOpen, callTableRef, strikeTableRef, putTableRef]);

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

  // useEffect to filter the option chain when current stock changes
  useEffect(() => {
    if (currentStock && currentExpirationDate && currentStock.info.regularMarketPrice) {
      const updatedFilteredOptionChain = getFilteredOptionChain(currentStock.optionChain, currentExpirationDate, displayStrikes, currentStock.info.regularMarketPrice);
      if (updatedFilteredOptionChain) {
        setFilteredOptionChain(updatedFilteredOptionChain);
      } else {
        setFilteredOptionChain(undefined);
      }
    };
  }, [currentExpirationDate, currentStock, displayStrikes]);


  if (!currentStock) {
    return (
      <div className={pageStyles.page}>
        <div className={pageStyles.wrapper}>
          <h2>Options</h2>
          <h3>Search for a stock symbol to view options.</h3>
        </div>
      </div>
    )
  }

  return (
    <div className={pageStyles.pageTwo}>
      <PageHeader />
      {/* Header Element */}
      {/* Controls Element */}
      {
        (filteredOptionChain) && (
          <div className={styles.controls}>
            <div className={styles.controlsElement}>
              <p>Strategies</p>
              <StyledButton variant="contained"
                onClick={handleOptionStrategy}
                endIcon={<ArrowDropDownOutlined />}
                sx={buttonStyles}>CALL / PUT</StyledButton>
            </div>
            <div className={styles.controlsElementTwo}>
              <p>Strikes</p>
              <div className={styles.anchor}>
                <StyledButton variant="contained"
                  onClick={() => setIsStrikesMenuOpen(prev => !prev)}
                  endIcon={<ArrowDropDownOutlined />}
                  ref={strikesMenuButtonRef}
                  sx={buttonStyles}>{displayStrikes === 1 ? "ALL" : displayStrikes}</StyledButton>
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
                    </div >
                  )}
              </div>
            </div>
            <div className={styles.controlsElementTwo}>
              <p>Near</p>
              <div className={styles.nearInput}>{
                currentStock.info?.regularMarketPrice?.toFixed(2)
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
        (filteredOptionChain) && (
          <div className={styles.controlsMobile}>
            <div className={styles.controlsElement}>
              <p>Strikes</p>
              <div className={styles.anchor}>
                <StyledButton variant="contained"
                  onClick={() => setIsStrikesMobileMenuOpen(prev => !prev)}
                  endIcon={<ArrowDropDownOutlined />}
                  ref={strikesMobileMenuButtonRef}
                  sx={buttonStyles}
                >{displayStrikes === 1 ? "ALL" : displayStrikes}</StyledButton>
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
                currentStock.info?.regularMarketPrice?.toFixed(2)
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
        (filteredOptionChain && currentExpirationDates) && (
          <div className={styles.dates}>
            {currentExpirationDates.map((date: string, index: number) => (
              <div className={styles.shadowButton} key={index} onClick={
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
        (filteredOptionChain) && (
          <div className={styles.optionChainWrapper}>
            {/* Calls Table */}
            {isCallTableOpen && (
              <div className={styles.tableCalls} ref={callTableRef}>
                <div className={styles.tableHeaderCalls}>
                  <div>
                    {
                      !isPutTableOpen &&
                      (

                        <ArrowLeftOutlined onClick={handleSetIsCallTableOpen} sx={{
                          color: 'gray'
                        }} />

                      )
                    }
                    <p>Calls</p>
                    {
                      isPutTableOpen && (
                        <ArrowRightOutlined onClick={handleSetIsCallTableOpen} sx={{
                          color: 'gray'
                        }} />
                      )
                    }
                  </div>
                </div>
                <ElementsHeaderTh />
                {(filteredOptionChain?.calls ?? []).map((data: OptionType, index: React.Key | null | undefined) => (
                  <div key={index} className={
                    (data?.strike && currentStock.info?.regularMarketPrice) &&
                      data?.strike < currentStock.info.regularMarketPrice ? styles.elementsHeaderTdTwo : styles.elementsHeaderTd
                  } onClick={() => handleDisplayOptionAnalytics(data)}>
                    <div className={styles.elementTdLink}><p>{data?.contractSize ? data?.bid?.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTd}><p
                      className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : '--'}>
                      {data?.contractSize ? data?.mark?.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTdLink}><p>{data?.contractSize ? data?.ask?.toFixed(2) : '--'}</p></div>
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
                      (
                      // <IconButton size='small' onClick={handleSetIsPutTableOpen}>
                      //   <ArrowLeftOutlined sx={{
                      //     color: 'gray'
                      //   }} />
                      // </IconButton>
                      <ArrowLeftOutlined onClick={handleSetIsPutTableOpen} sx={{
                        color: 'gray'
                      }} />
                      )
                    }
                    <p>Puts</p>
                    {
                      !isCallTableOpen && (
                        // <IconButton size='small' onClick={handleSetIsPutTableOpen}>
                        //   <ArrowRightOutlined sx={{
                        //     color: 'gray'
                        //   }} />
                        // </IconButton>
                          <ArrowRightOutlined onClick={handleSetIsPutTableOpen} sx={{
                            color: 'gray'
                          }} />
                        )
                    }
                  </div>
                </div>
                <ElementsHeaderTh />
                {(filteredOptionChain?.puts ?? []).map((data: OptionType, index: React.Key | null | undefined) => (
                  <div key={index} className={
                    (data?.strike && currentStock.info?.regularMarketPrice) &&
                      data?.strike > currentStock.info.regularMarketPrice ? styles.elementsHeaderTdTwo : styles.elementsHeaderTd
                  } onClick={() => handleDisplayOptionAnalytics(data)}>
                    <div className={styles.elementTdLink}><p>{data?.contractSize ? data?.bid?.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTd}><p
                      className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>
                      {data?.contractSize ? data?.mark?.toFixed(2) : '--'}</p></div>
                    {/* <div className={styles.elementTdLink}><p>{data?.ask ? data.ask.toFixed(2) : '--'}</p></div> */}
                    <div className={styles.elementTdLink}><p>{data?.contractSize ? data?.ask?.toFixed(2) : '--'}</p></div>
                    <div className={styles.elementTd}><p className={data?.percentChange ? data.percentChange === 0 ? '' : isNumPositive(data.percentChange) ? styles.positive : styles.negative : ''}>{data?.contractSize ? data?.lastPrice?.toFixed(2) : '--'}</p></div>
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


