'use client'

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useAppContext } from "./providers/AppProvider";
import { useAuthContext } from "./providers/AuthProvider";
import { ArrowDropDownOutlined, CheckOutlined } from "@mui/icons-material";
import { OptionType, StrikeType } from "./types/types";
import { StyledButton, StyledButtonTwo, StyledTextField } from "./components/Styled";
import { formatDate, formatPlusMinus } from "./utils/utils";

const menuButtonStyle = {
  borderRadius: '0px',
  borderTop: 'none',
  borderBottom: 'none',
  border: 'none',
  justifyContent: 'space-between',
  height: '2rem',
  // minWidth: '6rem'
}

export default function Options() {
  const { currentExpirationDate,
    currentNearPrice,
    currentStock, isPageExt, optionChain, optionExpirationDates, totalStrikesToDisplay, fetchStockData, setCurrentOption, setModalView } = useAppContext();
  const { setInfo } = useAuthContext();
  const [nearPriceInputValue, setNearInputValue] = useState('');
  const [isStrikesMenuOpen, setIsStrikesMenuOpen] = useState(false);

  const strikesMenuRef = React.useRef<HTMLDivElement>(null);
  const strikesMenuButtonRef = React.useRef<HTMLButtonElement>(null);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleFetchExpirationDate = async (expirationDate: string) => {
    console.log('currentExpirationDate', currentExpirationDate);
    console.log('expirationDate', expirationDate);

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

  const handleSetTotalStrikesToDisplay = async (totalStrikes: 1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40) => {
    if (totalStrikes == totalStrikesToDisplay) return;
    if (currentStock?.symbol == null) return;
    const symbol = currentStock.symbol;
    const expirationDate = currentExpirationDate;
    try {
      await fetchStockData(symbol, expirationDate, undefined, totalStrikes);
      setIsStrikesMenuOpen(false);
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleDisplayOptionAnalytics = (option: OptionType) => {
    setCurrentOption(option);
    setModalView('analytics');
  };

  if (currentStock == null)
    return (
      <div className={isPageExt ? styles.pageExt : styles.page}>
        <div className={styles.pageHeader}>
          <h1>Welcome to Options Project</h1>
          <h2>An easy to use options analytical tool.</h2>
          <h2>Search a symbol to get started.</h2>
        </div>
      </div>
    );

  return (
    <div className={isPageExt ? styles.pageExt : styles.page}>
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlsLeading}>
          <StyledButton variant="contained"
            onClick={handleOptionStrategy}
            endIcon={<ArrowDropDownOutlined />}
            sx={{
              borderRadius: '0px',
              width: 'fit-content',
              height: '2rem',
              whiteSpace:
                'nowrap',
            }}>CALL / PUT</StyledButton>
          <div className={styles.controlsLeadingElement}>
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
                  height: '2rem',
                  minWidth: '6rem',
                  whiteSpace:
                    'nowrap',
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
          <div className={styles.controlsLeadingElementNear}>
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
      </div>

      <div className={styles.controlsMobile}>
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

      {/* Dates */}
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

      {/* Option Chain */}
      <div className={styles.optionChainTable}>
        <div className={styles.tableHeaderWrapper}>
          <div className={styles.tableHeader}>
            <div className={styles.tableRowCallHeader}>
              <div className={styles.tableTh}>
                <p>Bid</p>
              </div>
              <div className={styles.tableTh}>
                <p>Mark</p>
              </div>
              <div className={styles.tableTh}>
                <p>Ask</p>
              </div>
              <div className={styles.tableTh}>
                <p>Last</p>
              </div>
              <div className={styles.tableTh}>
                <p>Change</p>
              </div>
              <div className={styles.tableTh}>
                <p>Change%</p>
              </div>
              <div className={styles.tableTh}>
                <p>Imp Vol</p>
              </div>
            </div>
            <div className={styles.tableRowType}>
              <p>Calls</p>
            </div>
          </div>
          <div className={styles.tableStrike}>
            <div className={styles.tableRowStrike}>
           <div className={styles.tableThStrike}>
                <p>Strike</p>
          </div>
            </div>
            <div className={styles.tableRowType}>
              <p>{formatDate(currentExpirationDate)}</p>
            </div>
          </div>
          <div className={styles.tableHeader} >
            <div className={styles.tableRowPutHeader}>
              <div className={styles.tableTh}>
                <p>Bid</p>
              </div>
              <div className={styles.tableTh}>
                <p>Mark</p>
              </div>
              <div className={styles.tableTh}>
                <p>Ask</p>
              </div>
              <div className={styles.tableTh}>
                <p>Last</p>
              </div>
              <div className={styles.tableTh}>
                <p>Change</p>
              </div>
              <div className={styles.tableTh}>
                <p>Change%</p>
              </div>
              <div className={styles.tableTh}>
                <p>Imp Vol</p>
              </div>
            </div>
            <div className={styles.tableRowType}>
              <p>Puts</p>
            </div>
          </div>
        </div>

        {/* Calls Table */}
        <div className={styles.tableWrapper}>
          <div className={styles.table} >
            {
              optionChain?.calls.map((data: OptionType, index: React.Key | null | undefined) => (
                <div className={styles.tableRowCall} key={index} onClick={() => handleDisplayOptionAnalytics(data)}>
                  <div className={styles.tableTdLink}>
                    <p>{data?.bid ? data.bid.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? styles.tableTdPositive
                        : styles.tableTdNegative
                      : styles.tableTd
                  }>
                    <p>{data?.mark ? data.mark.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={styles.tableTdLink}>
                    <p>{data?.ask ? data.ask.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? styles.tableTdPositive
                        : styles.tableTdNegative
                      : styles.tableTd
                  }>
                    <p>{data?.lastPrice ? data.lastPrice.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? styles.tableTdPositive
                        : styles.tableTdNegative
                      : styles.tableTd
                  }>
                    <p>{data?.change ? formatPlusMinus(data.change) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? styles.tableTdPositive
                        : styles.tableTdNegative
                      : styles.tableTd
                  }>
                    <p>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '0.00%'}</p>
                  </div>
                  <div className={styles.tableTd}>
                    <p>{data?.impliedVolatility ? `${(data.impliedVolatility * 100).toFixed(2)}%` : '0.00%'}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Strikes Table */}
          <div className={styles.tableStrike}>
            {
              optionChain?.strikes.map((data: StrikeType, index: React.Key | null | undefined) => (
                <div className={styles.tableRowStrike} key={index}>
                  <div className={styles.tableTdStrike}>
                    <p>{data.strike}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Puts Table */}
          <div className={styles.table} >
            {
              optionChain?.puts.map((data: OptionType, index: React.Key | null | undefined) => (
                <div className={styles.tableRowPut} key={index} onClick={() => handleDisplayOptionAnalytics(data)}>
                  <div className={styles.tableTdLink}>
                    <p>{data?.bid ? data.bid.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={data?.percentChange != null && data?.percentChange != 0
                    ? data.percentChange > 0
                      ? styles.tableTdPositive
                      : styles.tableTdNegative
                    : styles.tableTd}>
                    <p>{data?.mark ? data.mark.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={styles.tableTdLink}>
                    <p>{data?.ask ? data.ask.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? styles.tableTdPositive
                        : styles.tableTdNegative
                      : styles.tableTd
                  }>
                    <p>{data?.lastPrice ? data.lastPrice.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? styles.tableTdPositive
                        : styles.tableTdNegative
                      : styles.tableTd
                  }>
                    <p>{data?.change ? formatPlusMinus(data.change) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? styles.tableTdPositive
                        : styles.tableTdNegative
                      : styles.tableTd
                  }>
                    <p>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '0.00%'}</p>
                  </div>
                  <div className={styles.tableTd}>
                    <p>{data?.impliedVolatility ? `${(data.impliedVolatility * 100).toFixed(2)}%` : '0.00%'}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};