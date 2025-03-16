'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AccountTreeOutlined, CropOutlined, Menu, RefreshOutlined, SearchOutlined, StackedBarChartOutlined } from '@mui/icons-material';
import { CircularProgress, InputAdornment } from '@mui/material';
import {
    usePathname
} from 'next/navigation';
import { useAppContext } from '@/app/providers/AppProvider';
import { useAuthContext } from '@/app/providers/AuthProvider';
import styles from "./Header.module.css";
import Link from 'next/link';
import { StyledIconButton, StyledTextField } from '@/app/components/Styled';
import { formatPlusMinus } from '@/app/utils/utils';

export default function Header() {
    const { currentExpirationDate, currentStock, indexesList, fetchStockData, fetchWatchListData } = useAppContext();
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

    const isNumPositive = (num: number) => {
        return num > 0;
    };

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

    const handleFetchStockDataSymbol = async (symbol: string) => {
        if (symbol.length === 0) return;
        try {
            await fetchStockData(symbol);
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
                                <p className={styles.symbol} onClick={() => handleFetchStockDataSymbol(
                                    data?.symbol ? data?.symbol : ''
                                )}>{data.symbol}</p>
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
            </div>

            {/* Top Element Mobile */}
            <div className={styles.headerElementSmallMobile}>
                <div className={styles.indexes}>
                    <p
                        onClick={() => handleFetchStockDataSymbol(
                            indexesList[2]?.symbol ? indexesList[2]?.symbol : ''
                        )}
                    >{indexesList[2]?.symbol}</p>
                    <p className={isNumPositive(indexesList[2]?.regularMarketChangePercent ? indexesList[2]?.regularMarketChangePercent : 0) ? styles.positive : styles.negative} >
                        {indexesList[2]?.regularMarketPrice && indexesList[2].regularMarketPrice.toFixed(2)}
                    </p>
                    <p className={isNumPositive(indexesList[2]?.regularMarketChangePercent ? indexesList[2]?.regularMarketChangePercent : 0) ? styles.positive : styles.negative} >
                        {(indexesList[2]?.regularMarketChange && formatPlusMinus(indexesList[2]?.regularMarketChange))}
                    </p>
                    <p className={isNumPositive(indexesList[2]?.regularMarketChangePercent ? indexesList[2]?.regularMarketChangePercent : 0) ? styles.positive : styles.negative} >
                        {indexesList[2]?.regularMarketChangePercent && `(${formatPlusMinus(indexesList[2].regularMarketChangePercent)})%`}
                    </p>
                </div>
            </div>

            {/* Bottom Element */}
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
                                                <div className={styles.link}><p>Light Mode</p></div>
                                                <div className={styles.link}><p>Dark Mode</p></div>
                                                <div className={styles.link}><p>System</p></div>
                                                {/* <div className={styles.link}><LightModeOutlined /><p>Light Mode</p></div>
                                                <div className={styles.link}><DarkModeOutlined /><p>Dark Mode</p></div>
                                                <div className={styles.link}><SettingsSystemDaydreamOutlined /><p>System</p></div> */}
                                            </div>
                                        )}
                                    </div>
                                    {/* <div className={styles.menuItem} onMouseEnter={handleDeviceMenuClose}><p>Logout</p></div> */}
                                </div>
                            )}
                    </div>
                </div>
            </div >
        </header>
    );
};