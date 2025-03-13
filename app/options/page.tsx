'use client'

import React, { useEffect, useState } from "react";
import pageStyles from "../page.module.css";
import optionStyles from "./page.module.css";
import { Button  } from "@mui/material";
import { useAppContext } from "../providers/AppProvider";
import { useAuthContext } from "../providers/AuthProvider";
import { ArrowDropDownOutlined, CheckOutlined } from "@mui/icons-material";
import { OptionType, StrikeType } from "../types/types";
// import { StyledTextField } from "../components/Styled";

const menuButtonStyle = {
  borderRadius: '0px',
  borderTop: 'none',
  borderBottom: 'none',
  border: 'none',
  justifyContent: 'space-between',
  height: '2rem',
  minWidth: '6rem'
}

export default function Options() {
  const { currentExpirationDate,
    //  currentNearPrice,
     currentStock, isPageExt, optionChain, optionExpirationDates, totalStrikesToDisplay, fetchStockData } = useAppContext();
  const { setInfo } = useAuthContext();
  // const [nearPriceInputValue, setNearInputValue] = useState(0);
  const [isStrikesMenuOpen, setIsStrikesMenuOpen] = useState(false);

  const strikesMenuRef = React.useRef<HTMLDivElement>(null);
  const strikesMenuButtonRef = React.useRef<HTMLButtonElement>(null);

  // useEffect(() => {
  //   setNearInputValue(currentNearPrice || 0);
  // }, [currentNearPrice]);

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

  const formatDate = (date: string | undefined) => {
    if (date == null) return '';
    const dateObj = new Date(date + 'T00:00:00Z');
    const currentYear = new Date().getFullYear();

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    };

    if (dateObj.getFullYear() !== currentYear) {
      options.year = "2-digit";
    }

    return dateObj.toLocaleDateString("en-US", options);
  };

  const formatPlusMinus = (price: number | undefined): string => {
    if (price == 0 || price == null) return '0.00';
    return price > 0 ? `+${price.toFixed(2)}` : price.toFixed(2);
  };

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

  if (currentStock == null)
    return (
      <div className={isPageExt ? pageStyles.pageExt : pageStyles.page}>
        <div className={pageStyles.pageHeader}>
          <h1>Options</h1>
          <h2>Search for a symbol to use options analytical tool</h2>
        </div>
      </div>
    );

  return (
    <div className={isPageExt ? pageStyles.pageExt : pageStyles.page}>
      {/* Controls */}
      <div className={optionStyles.controls}>
        <div className={optionStyles.controlsLeading}>
          <Button variant="outlined"
            onClick={handleOptionStrategy}
            endIcon={<ArrowDropDownOutlined />}
            sx={{
              borderRadius: '0px',
              width: 'fit-content',
              height: '2rem',
              whiteSpace:
                'nowrap',
            }}>CALL / PUT</Button>
          <div className={optionStyles.controlsLeadingElement}>
            <p>Strikes</p>
            <div className={optionStyles.anchor}>
              <Button variant="outlined"
                onClick={() => setIsStrikesMenuOpen(prev => !prev)}
                endIcon={<ArrowDropDownOutlined />}
                ref={strikesMenuButtonRef}
                sx={{
                  borderRadius: '0px',
                  backgroundColor: 'fff',
                  justifyContent: 'space-between',
                  height: '2rem',
                  minWidth: '6rem',
                }}>{totalStrikesToDisplay === 1 ? "ALL" : totalStrikesToDisplay}</Button>
              {
                isStrikesMenuOpen && (
                  <div className={optionStyles.menu} ref={strikesMenuRef}>
                    <Button variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(4)}>4</Button>
                    <Button variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(6)}>6</Button>
                    <Button variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(8)}>8</Button>
                    <Button variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(10)}>10</Button>
                    <Button variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(12)}>12</Button>
                    <Button variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(16)}>16</Button>
                    <Button variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(20)}>20</Button>
                    <Button variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(40)}>40</Button>
                    <Button variant="outlined" sx={menuButtonStyle} onClick={() => handleSetTotalStrikesToDisplay(1)}>ALL</Button>
                  </div >
                )}
            </div>
          </div>
          {/* <div className={optionStyles.controlsLeadingElementNear}>
            <p>Near</p>
            <StyledTextField
              id="nearPrice"
              variant="outlined"
              value={nearPriceInputValue.toFixed(2)}
              // onChange={(event) => setNearInputValue(event.target.value)}
              sx={{
                width: '5rem',

              }}
              autoComplete="off"></StyledTextField>
          </div> */}
        </div>
      </div>

      {/* Dates */}
      <div className={optionStyles.dates}>
        {optionExpirationDates.map((date: string, index) => (
          <Button key={index}
            variant={date == currentExpirationDate ? 'outlined' : 'text'}
            // variant={date == currentExpirationDate ? 'contained' : 'text'}
            // variant='text'
            onClick={() => handleFetchExpirationDate(date)}
            sx={{
              textAlign: 'center',
              borderRadius: '0px',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
              height: '2rem',
              transition: 'background-color 0.3s, border-color 0.3s, transform 0.3s', // Add transition effect
              // '&:hover': {
              //   backgroundColor: date == currentExpirationDate ? 'primary.main' : 'transparent', // Ensure background color remains consistent
              //   transform: 'scale(1.05)', // Slightly scale up the button on hover
              // },
              // '& .MuiButton-startIcon': {
              //   transition: 'transform 0.3s', // Add transition effect to startIcon
              // },
              // '&:hover .MuiButton-startIcon': {
              //   transform: 'scale(1.1)', // Scale up the startIcon on hover
              // },
            }}
            startIcon={
              date == currentExpirationDate
                ? <CheckOutlined />
                : null
            }>{formatDate(date)}
          </Button>
        ))}
      </div>

      {/* Option Chain */}
      <div className={optionStyles.optionChainTable}>
        <div className={optionStyles.tableHeaderWrapper}>
          <div className={optionStyles.tableHeader}>
            <div className={optionStyles.tableRowHeader}>
              <div className={optionStyles.tableTh}>
                <p>Bid</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Mark</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Ask</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Change</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Change%</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Imp Vol</p>
              </div>
            </div>
            <div className={optionStyles.tableThType}>
              <p>Calls</p>
            </div>
          </div>
          <div className={optionStyles.tableStrike}>
            <div className={optionStyles.tableThStrike}>
              <p>Strikes</p>
            </div>
            <div className={optionStyles.tableThType}>
              <p>{formatDate(currentExpirationDate)}</p>
            </div>
          </div>
          <div className={optionStyles.tableHeader} >
            <div className={optionStyles.tableRowHeader}>
              <div className={optionStyles.tableTh}>
                <p>Bid</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Mark</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Ask</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Change</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Change%</p>
              </div>
              <div className={optionStyles.tableTh}>
                <p>Imp Vol</p>
              </div>
            </div>
            <div className={optionStyles.tableThType}>
              <p>Puts</p>
            </div>
          </div>
        </div>

        {/* Calls Table */}
        <div className={optionStyles.tableWrapper}>
          <div className={optionStyles.table} >
            {
              optionChain?.calls.map((data: OptionType, index: React.Key | null | undefined) => (
                <div className={optionStyles.tableRow} key={index}>
                  <div className={optionStyles.tableTdLink}>
                    <p>{data?.bid ? data.bid.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? optionStyles.tableTdPositive
                        : optionStyles.tableTdNegative
                      : optionStyles.tableTd
                  }>
                    <p>{data?.mark ? data.mark.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={optionStyles.tableTdLink}>
                    <p>{data?.ask ? data.ask.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? optionStyles.tableTdPositive
                        : optionStyles.tableTdNegative
                      : optionStyles.tableTd
                  }>
                    <p>{data?.change ? formatPlusMinus(data.change) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? optionStyles.tableTdPositive
                        : optionStyles.tableTdNegative
                      : optionStyles.tableTd
                  }>
                    <p>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '0.00%'}</p>
                  </div>
                  <div className={optionStyles.tableTd}>
                    <p>{data?.impliedVolatility ? `${(data.impliedVolatility * 100).toFixed(2)}%` : '0.00%'}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Strikes Table */}
          <div className={optionStyles.tableStrike}>
            {
              optionChain?.strikes.map((data: StrikeType, index: React.Key | null | undefined) => (
                <div className={optionStyles.tableRowStrike} key={index}>
                  <div className={optionStyles.tableTdStrike}>
                    <p>{data.strike}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Puts Table */}
          <div className={optionStyles.table} >
            {
              optionChain?.puts.map((data: OptionType, index: React.Key | null | undefined) => (
                <div className={optionStyles.tableRow} key={index}>
                  <div className={optionStyles.tableTdLink}>
                    <p>{data?.bid ? data.bid.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={data?.percentChange != null && data?.percentChange != 0
                    ? data.percentChange > 0
                      ? optionStyles.tableTdPositive
                      : optionStyles.tableTdNegative
                    : optionStyles.tableTd}>
                    <p>{data?.mark ? data.mark.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={optionStyles.tableTdLink}>
                    <p>{data?.ask ? data.ask.toFixed(2) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? optionStyles.tableTdPositive
                        : optionStyles.tableTdNegative
                      : optionStyles.tableTd
                  }>
                    <p>{data?.change ? formatPlusMinus(data.change) : '0.00'}</p>
                  </div>
                  <div className={
                    data?.percentChange != null && data?.percentChange != 0
                      ? data.percentChange > 0
                        ? optionStyles.tableTdPositive
                        : optionStyles.tableTdNegative
                      : optionStyles.tableTd
                  }>
                    <p>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '0.00%'}</p>
                  </div>
                  <div className={optionStyles.tableTd}>
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