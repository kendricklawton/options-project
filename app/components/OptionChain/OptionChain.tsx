'use client';

import { ArrowDropDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined, PlaylistAdd } from '@mui/icons-material';
import styles from './OptionChain.module.css';
import { IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/app/providers/AppProvider';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { StyledButton, StyledButtonTwo, StyledIconButton, StyledTextField } from '../Styled';
import { convertUnixTimestamp, formatDate, formatMarketCap, formatPlusMinus } from '@/app/utils/utils';
import { OptionType, StrikeType } from '@/app/types/types';
import React from 'react';

const menuButtonStyle = {
    borderRadius: '0px',
    borderTop: 'none',
    borderBottom: 'none',
    border: 'none',
    justifyContent: 'space-between',
    height: '2rem',
}

export default function OptionChain() {
    const {
        currentExpirationDate,
        currentNearPrice,
        currentStock,
        optionChain,
        optionExpirationDates,
        totalStrikesToDisplay,
        fetchStockData,
        setCurrentOption,
        setModalView } = useAppContext();
    const { setInfo } = useAuthContext();

    const [nearPriceInputValue, setNearInputValue] = useState('');
    const [isStrikesMenuOpen, setIsStrikesMenuOpen] = useState(false);
    const [isCallTableOpen, setIsCallTableOpen] = useState(true);
    const [isPutTableOpen, setIsPutTableOpen] = useState(true);
    const [isBottomElementOpen, setIsBottomElementOpen] = useState(false);

    const strikesMenuRef = useRef<HTMLDivElement>(null);
    const strikesMenuButtonRef = useRef<HTMLButtonElement>(null);

    // Refs for the three scrollable elements
    const callTableRef = useRef<HTMLDivElement>(null);
    const strikeTableRef = useRef<HTMLDivElement>(null);
    const putTableRef = useRef<HTMLDivElement>(null);

    const isNumPositive = (num: number) => {
        return num > 0;
    };

    const handleAddToWatchList = () => {
        console.log('Add to watch list');
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
        console.log('option', option);
        setCurrentOption(option);
        setModalView('analytics');
    };

    // Function to sync the scroll position of multiple elements
    const syncScroll = (source: HTMLElement, targets: HTMLElement[]) => {
        targets.forEach((target) => {
            if (source !== target) {
                target.scrollTop = source.scrollTop;
            }
        });
    };

    {/* Details */ }
    const Details = () => {
        return (
            <React.Fragment>
                {/* Details Element */}
                {currentStock && (
                    <div className={styles.details}>
                        <div>
                            <p>{currentStock.shortName?.toLocaleUpperCase()}</p>
                            <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                                ? currentStock.regularMarketChangePercent > 0
                                    ? styles.positive
                                    : styles.negative
                                : ''
                            }>{currentStock.regularMarketPrice?.toFixed(2)} </p>
                            <p>{currentStock.currency}</p>
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

                            <StyledIconButton onClick={handleAddToWatchList} size='small'>
                                <PlaylistAdd />
                            </StyledIconButton>
                        </div>
                        <div>
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
                )}

                {/* Details Extended Element */}
                {
                    (isBottomElementOpen && currentStock) && (
                        <div className={styles.detailsExt}>
                            <div className={styles.elementTh}>
                                <p>Open</p>
                                <p>{currentStock.regularMarketOpen}</p>
                            </div>
                            <div className={styles.elementTh}>
                                <p>High</p>
                                <p>{currentStock.regularMarketDayHigh}</p>
                            </div>
                            <div className={styles.elementTh}>
                                <p>Low</p>
                                <p>{currentStock.regularMarketDayLow}</p>
                            </div>
                            <div className={styles.elementTh}>
                                <p>Market Cap</p>
                                <p>{formatMarketCap(currentStock.marketCap)}</p>
                            </div>
                            <div className={styles.elementTh}>
                                <p>P/E Ratio</p>
                                <p>{currentStock.forwardPE?.toFixed(2)}</p>
                            </div>
                            <div className={styles.elementTh}>
                                <p>Div Yield</p>
                                <p>
                                    {
                                        (currentStock.dividendYield != null && currentStock.dividendYield != 0)
                                            ? `${(currentStock.dividendYield).toFixed(2)}%`
                                            : '0.00%'
                                    }
                                </p>
                            </div>
                            <div className={styles.elementTh}>
                                <p>52 Week Range</p>
                                <p>{currentStock.fiftyTwoWeekRange}</p>
                            </div>
                        </div>
                    )
                }
            </React.Fragment>
        );
    };

    {/* Controls */ }
    const Controls = () => {
        return (
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
        );
    };

    {/* Controls Mobile */ }
    const ControlsMobile = () => {
        return (
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
        );
    };

    useEffect(() => {
        const callTable = callTableRef.current;
        const strikeTable = strikeTableRef.current;
        const putTable = putTableRef.current;
        console.log('callTable', callTable);
        console.log('strikeTable', strikeTable);
        console.log('putTable', putTable);
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
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    if (currentStock == null)
        return (
            <div className={styles.pageHeader}>
                <h1>Welcome to Options Project</h1>
                <h2>An easy to use options analytical tool.</h2>
                <h2>Search a symbol to get started.</h2>
            </div>
        );

    return (
        <div className={styles.wrapper}>
            <Details />
            <Controls />
            <ControlsMobile />
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
            <div className={styles.optionChainWrapper}>
                {
                    isCallTableOpen &&
                    (
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
                            <div className={styles.elementsHeaderThCalls}>
                                <div className={styles.elementTh}><p>Bid</p></div>
                                <div className={styles.elementTh}><p>Mark</p></div>
                                <div className={styles.elementTh}><p>Ask</p></div>
                                <div className={styles.elementTh}><p>Change</p></div>
                                <div className={styles.elementTh}><p>Change</p><p>Percent</p></div>
                                <div className={styles.elementTh}><p>Last</p></div>
                                <div className={styles.elementTh}><p>Volume</p></div>
                                <div className={styles.elementTh}><p>Implied</p><p>Volatility</p></div>
                                <div className={styles.elementTh}><p>Contart</p><p>Size</p></div>
                                <div className={styles.elementTh}><p>Open</p><p>Interest</p></div>
                            </div>
                            {optionChain?.calls.map((data: OptionType, index: React.Key | null | undefined) => (
                                <div key={index} className={styles.elementsHeaderTdCalls} onClick={() => handleDisplayOptionAnalytics(data)}>
                                    <div className={styles.elementTdLink}><p>{data?.bid ? data.bid.toFixed(2) : '0.00'}</p></div>
                                    <div className={styles.elementTd}><p
                                        className={isNumPositive(data?.percentChange ? data.percentChange : 0) ? styles.positive : styles.negative}>{data?.mark ? data.mark.toFixed(2) : '0.00'}</p></div>
                                    <div className={styles.elementTdLink}><p>{data?.ask ? data.ask.toFixed(2) : '0.00'}</p></div>
                                    <div className={styles.elementTd}><p className={isNumPositive(data?.percentChange ? data.percentChange : 0) ? styles.positive : styles.negative} >{data?.change ? formatPlusMinus(data.change) : '0.00'}</p></div>
                                    <div className={styles.elementTd}><p className={isNumPositive(data?.percentChange ? data.percentChange : 0) ? styles.positive : styles.negative}>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '0.00%'}</p></div>
                                    <div className={styles.elementTd}><p className={isNumPositive(data?.percentChange ? data.percentChange : 0) ? styles.positive : styles.negative}>{data?.lastPrice ? data.lastPrice.toFixed(2) : '0.00'}</p></div>
                                    <div className={styles.elementTd}><p>{data?.volume ? data.volume : '0'}</p></div>
                                    <div className={styles.elementTd}><p>{data?.impliedVolatility ? `${(data.impliedVolatility * 100).toFixed(2)}%` : '0.00%'}</p></div>
                                    <div className={styles.elementTd}><p>{data?.contractSize ? data.contractSize : '0'}</p></div>
                                    <div className={styles.elementTd}><p>{data?.openInterest ? data.openInterest : '0'}</p></div>
                                </div>
                            ))}
                        </div>
                    )
                }
                <div className={styles.tableStrikes} ref={strikeTableRef}>
                    <div className={styles.tableHeaderStrikes}>
                        <p>Strikes</p>
                    </div>

                    <div className={styles.elementsHeaderThStrikes}>
                        <div className={styles.elementThStrikes}><p>{currentExpirationDate}</p></div>
                    </div>

                    {optionChain?.strikes.map((data: StrikeType, index: React.Key | null | undefined) => (
                        <div key={index} className={styles.elementsHeaderTdStrikes}>
                            <div className={styles.elementTdStrikes}> <p>{data.strike}</p></div>
                        </div>
                    ))}
                </div>
                {
                    isPutTableOpen &&
                    (
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
                            <div className={styles.elementsHeaderThPuts}>
                                <div className={styles.elementTh}><p>Bid</p></div>
                                <div className={styles.elementTh}><p>Mark</p></div>
                                <div className={styles.elementTh}><p>Ask</p></div>
                                <div className={styles.elementTh}><p>Volume</p></div>
                                <div className={styles.elementTh}><p>Change</p></div>
                                <div className={styles.elementTh}><p>Change</p><p>Percent</p></div>
                                <div className={styles.elementTh}><p>Last</p></div>
                                <div className={styles.elementTh}><p>Implied</p><p>Volatility</p></div>
                                <div className={styles.elementTh}><p>Contart</p><p>Size</p></div>
                                <div className={styles.elementTh}><p>Open</p><p>Interest</p></div>
                            </div>
                            {optionChain?.puts.map((data: OptionType, index: React.Key | null | undefined) => (
                                <div key={index} className={styles.elementsHeaderTdCalls} onClick={() => handleDisplayOptionAnalytics(data)}>
                                    <div className={styles.elementTdLink}><p>{data?.bid ? data.bid.toFixed(2) : '0.00'}</p></div>
                                    <div className={styles.elementTd}><p className={isNumPositive(data?.percentChange ? data.percentChange : 0) ? styles.positive : styles.negative}>{data?.mark ? data.mark.toFixed(2) : '0.00'}</p></div>
                                    <div className={styles.elementTdLink}><p>{data?.ask ? data.ask.toFixed(2) : '0.00'}</p></div>
                                    <div className={styles.elementTd}><p className={isNumPositive(data?.percentChange ? data.percentChange : 0) ? styles.positive : styles.negative}>{data?.change ? formatPlusMinus(data.change) : '0.00'}</p></div>
                                    <div className={styles.elementTd}><p className={isNumPositive(data?.percentChange ? data.percentChange : 0) ? styles.positive : styles.negative}>{data?.percentChange ? `${formatPlusMinus(data.percentChange)}%` : '0.00%'}</p></div>
                                    <div className={styles.elementTd}><p className={isNumPositive(data?.percentChange ? data.percentChange : 0) ? styles.positive : styles.negative}> {data?.lastPrice ? data.lastPrice.toFixed(2) : '0.00'}</p></div>
                                    <div className={styles.elementTd}><p>{data?.volume ? data.volume : '0'}</p></div>
                                    <div className={styles.elementTd}><p>{data?.impliedVolatility ? `${(data.impliedVolatility * 100).toFixed(2)}%` : '0.00%'}</p></div>
                                    <div className={styles.elementTd}><p>{data?.contractSize ? data.contractSize : '0'}</p></div>
                                    <div className={styles.elementTd}><p>{data?.openInterest ? data.openInterest : '0'}</p></div>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
};