'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
    // CloseOutlined,
    // Menu,
    Person2,
    SearchOutlined,
} from '@mui/icons-material';
import {
    CircularProgress,
    InputAdornment
} from '@mui/material';
import {
    usePathname,
    useRouter
} from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';
import styles from "./Header.module.css";
import Link from 'next/link';
import { StyledTextField } from '@/app/components/Styled';
import { useAppStore } from '@/app/stores/useAppStore';

const iconStyles = {
    cursor: 'pointer',
}

export default function Header() {
    const { currentStock, clearStockData, fetchStockData } = useAppStore();
    const { isLoading,
        setIsLoading,
        // logIn, logOut
    } = useAuthContext();

    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);

    const deviceMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<SVGSVGElement>(null);
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
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClearStockData = () => {
        clearStockData();
    };

    const handleFetchStockData = async () => {
        if (inputValue.length === 0) return;
        setIsLoading(true);
        try {
            const symbols: string[] = [inputValue];
            if (currentStock?.info.symbol !== inputValue) {
                await fetchStockData(symbols);
            }
            if (pathname === '/' || pathname === '/projects') {
                router.push('/options');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setInputValue('');
        }
     
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

    if (pathname === '/login') {
        return null;
    }

    return (
        <header className={styles.headerWrapper}>
            <div className={styles.header}>
                <div className={styles.leading}>
                    {/* <Link href={'/'} className={styles.optionsProject}>
                        OPTIONSPROJECT.IO
                    </Link> */}
                    <Link href={'/'}>
                        <Image
                            src="next.svg"
                            width={100}
                            height={40}
                            alt=""
                        />
                    </Link>
                    <StyledTextField
                        sx={{ minWidth: '8rem', maxWidth: '7rem' }}
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
                    {
                        currentStock && (
                            <p className={styles.link} onClick={handleClearStockData}>CLEAR</p>
                        )
                    }
                    {
                        isLoading && (
                            <CircularProgress size={20} sx={iconStyles} />
                        )
                    }
                </div>

                <div className={styles.trailing}>
                    <div className={styles.anchor}>
                        <Person2 onClick={handleMenuToggle} sx={iconStyles} ref={
                            menuButtonRef
                        } />
                        {
                            isMenuOpen && (
                                <div className={styles.menu} ref={menuRef} onMouseEnter={handleDeviceMenuClose}>
                                    <div className={styles.anchor}>
                                        <div className={styles.menuItem} onClick={handleDeviceMenuOpen} onMouseEnter={handleDeviceMenuOpen}>
                                            {/* <SettingsBrightnessOutlined /> */}
                                            <p>DEVICE</p>
                                        </div>
                                        {isDeviceMenuOpen && (
                                            <div className={styles.modeMenu} ref={deviceMenuRef}>
                                                <div className={styles.menuItem}>
                                                    {/* <LightModeOutlined /> */}
                                                    LIGHT MODE
                                                </div>
                                                <div className={styles.menuItem}>
                                                    {/* <DarkModeOutlined /> */}
                                                    DARK MODE
                                                </div>
                                                <div className={styles.menuItem}>
                                                    {/* <SettingsBrightnessOutlined /> */}
                                                    DEVICE
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.menuItem}>

                                    <Link href='/login' onMouseEnter={handleDeviceMenuClose}>
                                        LOGIN
                                    </Link>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
            <div className={styles.header}>
                <div className={styles.links}>
                    <Link className={pathname === '/options' ? styles.linkActive : styles.link} href={'/options'}>
                        {/* <CropOutlined />  */}
                        OPTIONS
                    </Link>
                    <Link className={pathname === '/projects' ? styles.linkActive : styles.link} href={'/projects'}>
                        {/* <AccountTreeOutlined />  */}
                        PROJECTS
                    </Link>
                </div>
            </div>
        </header>
    );
};

