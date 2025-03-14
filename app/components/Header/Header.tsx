'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AccountTreeOutlined, ArrowDropDownOutlined, ArrowLeftOutlined, CropOutlined, DarkModeOutlined, LightModeOutlined, Menu, PlaylistAdd, RefreshOutlined, SearchOutlined, StackedBarChartOutlined } from '@mui/icons-material';
import { CircularProgress, InputAdornment } from '@mui/material';
import {
    usePathname
} from 'next/navigation';
import { useAppContext } from '@/app/providers/AppProvider';
import { useAuthContext } from '@/app/providers/AuthProvider';
import styles from "./Header.module.css";
import Link from 'next/link';
import { StyledIconButton, StyledTextField } from '@/app/components/Styled';
import { convertUnixTimestamp, formatMarketCap, formatPlusMinus } from '@/app/utils/utils';

export default function Header() {
    const { currentExpirationDate, currentStock, isPageExt, indexesList, fetchStockData, fetchWatchListData, handleIsPageExt } = useAppContext();
    const { isLoading } = useAuthContext();

    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
    const [headerScrolled, setHeaderScrolled] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const deviceMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // const handleAccount = () => {
    //     setModalView('account');
    //     setIsMenuOpen(false);
    // };

    const handleAddToWatchList = () => {
        console.log('Add to watch list');
    };

    // const handleClearStockData = () => {
    //     if (!currentStock) {
    //         return;
    //     }
    //     setInputValue('');
    //     clearStockData();
    // };

    const handleDeviceMenuOpen = () => {
        setIsDeviceMenuOpen(true);
    };

    const handleDeviceMenuClose = () => {
        setIsDeviceMenuOpen(false);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleFetchStockData = async () => {
        if (inputValue.length === 0) return;
        if (currentStock?.symbol?.toLowerCase() == inputValue.toLowerCase()) return;
        try {
            await fetchStockData(inputValue);
            setInputValue('');
        } catch (error) {
            console.log(error);
        }
    };

    const handleRefreshStockData = async () => {
        if (currentStock?.symbol == null) return;
        const expirationDate = currentExpirationDate;
        const symbol = currentStock.symbol;
        try {
            fetchStockData(symbol, expirationDate);
            fetchWatchListData();
        }
        catch (error) {
            console.error(error);
        }
    };

    // const handleLogIn = () => {
    //     router.push('/login');
    // };

    // const handleLogOut = async () => {
    //     try {
    //         await logOut();
    //         setIsMenuOpen(false);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                if (!menuButtonRef.current?.contains(event.target as Node)) {
                    setIsMenuOpen(false);
                    setIsDeviceMenuOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setHeaderScrolled(true);
            } else {
                setHeaderScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (pathname === '/login') {
        return null;
    }

    return (
        <header className={headerScrolled ? styles.headerScrolling : styles.header}>
            {/* Top Element Desktop */}
            <div className={styles.headerElementSmallDesktop}>
                <div className={styles.indexesList}>
                    {
                        indexesList.map((data, index) => (
                            <div className={styles.indexes} key={index}>
                                <p>{data.symbol}</p>
                                <p className={data.regularMarketChangePercent != null && data.regularMarketChangePercent != 0
                                    ? data.regularMarketChangePercent > 0
                                        ? styles.leadingPPos
                                        : styles.leadingPNeg
                                    : ''}>

                                    {data.regularMarketPrice?.toFixed(2)
                                    }</p>
                                {
                                    data.regularMarketPrice && (
                                        <p className={data.regularMarketChangePercent != null && data.regularMarketChangePercent != 0
                                            ? data.regularMarketChangePercent > 0
                                                ? styles.leadingPPos
                                                : styles.leadingPNeg
                                            : ''
                                        }>
                                            {`(${formatPlusMinus(data.regularMarketChange)})`}
                                        </p>
                                    )
                                }
                             <p className={data.regularMarketChangePercent != null && data.regularMarketChangePercent != 0
                                    ? data.regularMarketChangePercent > 0
                                        ? styles.leadingPPos
                                        : styles.leadingPNeg
                                    : ''}>
                                    {`(${formatPlusMinus(data.regularMarketChangePercent)})%`}
                                </p> 
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Top Element Mobile */}
            <div className={styles.headerElementSmallMobile}>
                <div className={styles.indexes}>
                    <p>{indexesList[2]?.symbol}</p>
                    <p className={indexesList[2]?.regularMarketChangePercent != null && indexesList[2]?.regularMarketChangePercent != 0
                        ? indexesList[2].regularMarketChangePercent > 0 ? styles.leadingPPos : styles.leadingPNeg : ''}
                    >
                        {indexesList[2]?.regularMarketPrice && indexesList[2].regularMarketPrice.toFixed(2)}
                    </p>
                    <p className={indexesList[2]?.regularMarketChangePercent != null && indexesList[2]?.regularMarketChangePercent != 0
                        ? indexesList[2].regularMarketChangePercent > 0 ? styles.leadingPPos : styles.leadingPNeg : ''}
                    >
                        {(indexesList[2]?.regularMarketChange && formatPlusMinus(indexesList[2]?.regularMarketChange))}
                    </p>
                    <p className={indexesList[2]?.regularMarketChangePercent != null && indexesList[2]?.regularMarketChangePercent != 0
                        ? indexesList[2].regularMarketChangePercent > 0
                            ? styles.leadingPPos
                            : styles.leadingPNeg
                        : ''
                    }
                    >
                        {indexesList[2]?.regularMarketChangePercent && `(${formatPlusMinus(indexesList[2].regularMarketChangePercent)})%`}
                    </p>
                </div>
            </div>

            {/* Center Element */}
            <div className={styles.headerElement}>
                <div className={styles.leading}>
                    <Link href={'/'}
                    >OPTIONS PROJECT</Link>
                    <StyledTextField
                        sx={{
                            maxWidth: '7.6rem',
                            margin: '0',
                            padding: '0',
                        }}
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue.toUpperCase()}
                        placeholder={currentStock?.symbol ? currentStock.symbol : 'SYMBOL'}
                        autoComplete="off"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end" sx={{
                                        touchAction: 'none',
                                        padding: 0,
                                        margin: 0
                                    }}>
                                        <SearchOutlined onClick={handleFetchStockData}
                                            sx={{
                                                cursor: 'pointer',
                                                color: 'grey',
                                            }} />
                                    </InputAdornment>
                                )
                            }
                        }}>
                    </StyledTextField>
                    <Link className={styles.linkDesktop} href={'/'}><CropOutlined />Options</Link>
                    <Link className={styles.linkDesktop} href={'/charts'}><StackedBarChartOutlined />Charts</Link>
                    <Link className={styles.linkDesktop} href={'/projects'}><AccountTreeOutlined />Projects</Link>
                </div>
                <div className={styles.trailing}>
                    {/* {
                        currentStock && (
                            <StyledIconButton ref={menuButtonRef}
                                size='small'
                                onClick={handleClearStockData}>
                                <CloseOutlined />
                            </StyledIconButton>
                        )
                    } */}
                    <StyledIconButton ref={menuButtonRef}
                        size='small'
                        onClick={handleRefreshStockData}>
                        {
                            isLoading
                                ?
                                <CircularProgress size={24} />
                                :
                                <RefreshOutlined />
                        }
                    </StyledIconButton>
                    <div className={styles.anchor}>
                        {/* // onClick={handleClearStockData} */}
                        <StyledIconButton ref={menuButtonRef}
                            size='small'
                            onClick={handleMenuToggle}>
                            <Menu />
                        </StyledIconButton>
                        {
                            isMenuOpen && (
                                <div className={styles.menu} ref={menuRef} onMouseEnter={handleDeviceMenuClose}>
                                    <Link className={styles.link} href={'/'} onMouseEnter={handleDeviceMenuClose}>
                                        Options
                                    </Link>
                                    <Link className={styles.link} href={'/charts'} onMouseEnter={handleDeviceMenuClose}>
                                        Charts
                                    </Link>
                                    <Link className={styles.link} href={'/projects'} onMouseEnter={handleDeviceMenuClose}>
                                        Projects
                                    </Link>
                                    <div className={styles.anchor}>
                                        <div onClick={handleDeviceMenuOpen}
                                            onMouseEnter={handleDeviceMenuOpen}
                                            className={styles.link}>
                                            <p>Device</p>
                                        </div>
                                        {isDeviceMenuOpen && (
                                            <div className={styles.modeMenu} ref={deviceMenuRef}>
                                                <div className={styles.link}><LightModeOutlined /><p>Light Mode</p></div>
                                                <div className={styles.link}><DarkModeOutlined /><p>Dark Mode</p></div>
                                            </div>
                                        )}
                                    </div>
                                    {/* <div className={styles.menuItem} onMouseEnter={handleDeviceMenuClose}><p>Logout</p></div> */}
                                </div>
                            )}
                    </div>
                </div>
            </div >
            {
                currentStock && (
                    <>
                        {/* Center Element */}
                        <div className={styles.headerElement}>
                            {currentStock && (
                                <>
                                    <div className={styles.containerRow}>
                                        <div className={styles.wrapperRow}>
                                            <div className={styles.indexes}>
                                                <p style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>{currentStock.shortName?.toLocaleUpperCase()}
                                                    {
                                                        currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                                                            ? currentStock.regularMarketChangePercent > 0
                                                                ? <ArrowDropDownOutlined />
                                                                : <ArrowDropDownOutlined />
                                                            : null
                                                    } <span className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                                                    ? currentStock.regularMarketChangePercent > 0
                                                        ? styles.leadingPPos
                                                        : styles.leadingPNeg
                                                    : ''
                                                }>{currentStock.regularMarketPrice?.toFixed(2)} {currentStock.currency}</span></p>
                                            </div>
                                            <div className={styles.leadingTwo}>
                                                <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                                                    ? currentStock.regularMarketChangePercent > 0
                                                        ? styles.leadingTwoPPos
                                                        : styles.leadingTwoPNeg
                                                    : ''
                                                }>{formatPlusMinus(currentStock.regularMarketChange)}</p>
                                                <p className={currentStock.regularMarketChangePercent != null && currentStock.regularMarketChangePercent != 0
                                                    ? currentStock.regularMarketChangePercent > 0
                                                        ? styles.leadingTwoPPos
                                                        : styles.leadingTwoPNeg
                                                    : ''
                                                }>({formatPlusMinus(currentStock.regularMarketChangePercent)}%)</p>
                                                <p>{convertUnixTimestamp(currentStock.regularMarketTime)}</p>
                                            </div>
                                        </div>
                                        <StyledIconButton onClick={handleAddToWatchList} size='small'>
                                            <PlaylistAdd />
                                        </StyledIconButton>
                                    </div>
                                    <div className={styles.trailing}>
                                        <StyledIconButton onClick={handleIsPageExt} size='small'>
                                            {
                                                isPageExt
                                                    ?
                                                    <ArrowLeftOutlined />
                                                    :
                                                    <ArrowDropDownOutlined />
                                            }
                                        </StyledIconButton>
                                    </div>
                                </>
                            )}
                        </div >
                        {/* Bottom Element */}
                        {
                            !isPageExt && (
                                <div className={styles.headerElement}>
                                    {currentStock && (
                                        <div className={styles.row}>
                                            <div className={styles.td}>
                                                <p>Open</p>
                                                <p>{currentStock.regularMarketOpen}</p>
                                            </div>
                                            <div className={styles.td}>
                                                <p>High</p>
                                                <p>{currentStock.regularMarketDayHigh}</p>
                                            </div>
                                            <div className={styles.td}>
                                                <p>Low</p>
                                                <p>{currentStock.regularMarketDayLow}</p>
                                            </div>
                                            <div className={styles.td}>
                                                <p>Market Cap</p>
                                                <p>{formatMarketCap(currentStock.marketCap)}</p>
                                            </div>
                                            <div className={styles.td}>
                                                <p>P/E Ratio</p>
                                                <p>{currentStock.forwardPE?.toFixed(2)}</p>
                                            </div>
                                            <div className={styles.td}>
                                                <p>Div Yield</p>
                                                <p>
                                                    {
                                                        (currentStock.dividendYield != null && currentStock.dividendYield != 0)
                                                            ? `${(currentStock.dividendYield).toFixed(2)}%`
                                                            : '0.00%'
                                                    }
                                                </p>
                                            </div>
                                            <div className={styles.td}>
                                                <p>52 Week Range</p>
                                                <p>{currentStock.fiftyTwoWeekRange}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    </>
                )
            }
        </header>
    );
};