'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    // AccountTreeOutlined,
    CloseOutlined,
    CropOutlined,
    Menu,
    // RefreshOutlined, 
    SearchOutlined,
    // StackedBarChartOutlined
} from '@mui/icons-material';
import {
    CircularProgress,
    InputAdornment
} from '@mui/material';
import {
    usePathname,
    useRouter
} from 'next/navigation';
import { useAppContext } from '@/app/providers/AppProvider';
import { useAuthContext } from '@/app/providers/AuthProvider';
import styles from "./Header.module.css";
import Link from 'next/link';
import { StyledIconButton, StyledTextField } from '@/app/components/Styled';


export default function Header() {
    const { currentStock, fetchStockData } = useAppContext();
    const { isLoading,
        setIsLoading,
        // logIn, logOut
    } = useAuthContext();

    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
    const [headerScrolled, setHeaderScrolled] = useState(false);

    const deviceMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    // const refreshButtonRef = useRef<HTMLButtonElement>(null);

    const pathname = usePathname();
    const router = useRouter();

    // const handleAccount = () => {
    //     setModalView('account');
    //     setIsMenuOpen(false);
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

        try {
            setIsLoading(true);
            const symbols: string[] = [inputValue];
            if (currentStock?.info.symbol !== inputValue) {
                await fetchStockData(symbols);
            }
            if (pathname === '/') {
                router.push('/options');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

        setInputValue('');
    };

    const handleOnChange = (value: string) => {
        value = value.toUpperCase();
        setInputValue(value);
    };

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
            {/* Main Element */}
            <div className={styles.headerElement}>
                <div className={styles.leading}>
                    <Link className={styles.linkDesktop} href={'/'}>OPTIONS PROJECT</Link>
                    <StyledTextField
                        sx={{ maxWidth: '7.6rem' }}
                        onChange={(e) => handleOnChange(e.target.value)}
                        value={inputValue}
                        placeholder={currentStock?.info.symbol ? currentStock.info.symbol : 'SYMBOL'}
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
                    <div className={styles.links}>
                        {/* <Link className={styles.linkDesktop} href={'/charts'}><StackedBarChartOutlined />Charts</Link> */}
                        <Link className={styles.linkDesktop} href={'/options'}><CropOutlined />OPTIONS</Link>
                        {/* <Link className={styles.linkDesktop} href={'/projects'}><AccountTreeOutlined />Projects</Link> */}
                    </div>
                </div>
                <div className={styles.trailing}>
                    {
                        isLoading && (
                            <StyledIconButton size='small' disabled>
                                <CircularProgress size={20} />
                            </StyledIconButton>
                        )
                    }
                    <div className={styles.anchor}>
                        <StyledIconButton ref={menuButtonRef}
                            size='small'
                            onClick={handleMenuToggle}>
                            {
                                isMenuOpen
                                    ? (
                                        <CloseOutlined />
                                    ) :
                                    (
                                        <Menu />
                                    )
                            }
                        </StyledIconButton>
                        {
                            isMenuOpen && (
                                <div className={styles.menu} ref={menuRef} onMouseEnter={handleDeviceMenuClose}>
                                    {/* <Link className={styles.link} href={'/charts'} onMouseEnter={handleDeviceMenuClose}>
                                        Charts
                                    </Link> */}
                                    <Link className={styles.link} href={'/options'} onMouseEnter={handleDeviceMenuClose}>
                                        Options
                                    </Link>
                                    {/* <Link className={styles.link} href={'/projects'} onMouseEnter={handleDeviceMenuClose}>
                                        Projects
                                    </Link> */}
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
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div >
        </header>
    );
};

