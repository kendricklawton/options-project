'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import axios from 'axios';

import { useAuthContext } from './AuthProvider';
import {
    AppContextType, OptionChainType, OptionOrderType, OptionType, StockType,
    // StrikeType 
} from '../types/types';
// import { loadCSVFiles } from '../utils/utils';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { setIsLoading, setInfo } = useAuthContext();
    const url = process.env.SERVER_URL as string || '';
    const [recentSearches, setRecentSearches] = useState<string[]>([
        // 'GOOGL', 'GOOGL', 'GOOGL', 'GOOGL', 'GOOGL'
    ]);
    const [currentOption, setCurrentOption] = useState<OptionType>();
    const [currentOptionOrder, setCurrentOptionOrder] = useState<OptionOrderType>();
    const [currentNearPrice, setCurrentNearPrice] = useState<number>();
    const [currentStock, setCurrentStock] = useState<StockType>();
    const [totalStrikesToDisplay, setTotalStrikesToDisplay] = useState<1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40>(1);
    const [currentExpirationDate, setCurrentExpirationDate] = useState<string>();
    const [optionExpirationDates, setOptionExpirationDates] = useState<string[]>([]);
    const [modalView, setModalView] = useState<string>('');
    const [optionChain, setOptionChain] = useState<OptionChainType>();
    const [indexesList, setIndexesList] = useState<StockType[]>([]);
    const [popularList, setPopularList] = useState<StockType[]>([]);
    const [watchList, setWatchList] = useState<StockType[]>([]);

    // Error Handling
    const handleError = useCallback((error: unknown) => {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'App/invalid-credential':
                    setInfo('Invalid credentials provided');
                    break;
                case 'App/email-already-in-use':
                    setInfo('Email already in use');
                    break;
                case 'App/invalid-email':
                    setInfo('Invalid email address');
                    break;
                case 'App/operation-not-allowed':
                    setInfo('Operation not allowed');
                    break;
                case 'App/weak-password':
                    setInfo('The password is too weak');
                    break;
                case 'App/too-many-requests':
                    setInfo('Access temporarily disabled due to many failed attempts');
                    break;
                default:
                    setInfo('Unknown FirebaseError, error.code: ' + error.code);
            }
        }

        else {
            setInfo('' + error);
        }
        throw error;
    }, [setInfo]);

    // Handle Search History
    const handleRecentSearches = useCallback((symbol: string) => {
        if (recentSearches.includes(symbol.toLocaleUpperCase())) {
            return;
        }

        const updatedSearches = [symbol.toLocaleUpperCase(), ...recentSearches];
        if (updatedSearches.length > 5) {
            updatedSearches.pop();
        }

        setRecentSearches(updatedSearches);
    }, [recentSearches]);

    // Handle Set Option By Strike
    const setOptionOrderByStrike = useCallback((strike: number, optionOrder: OptionOrderType, optionType: 'Call' | 'Put'): void => {
        if (!optionChain) {
            return;
        }
        if (optionOrder.option?.strike === strike) {
            return;
        }
        console.log('strike', strike);
        if (optionType === 'Call') {
            const call = optionChain.calls.find(call => call.strike === strike);
            if (call) {
                const newOptionOrder = { ...optionOrder, option: call };
                console.log('newOptionOrder', newOptionOrder);
                setCurrentOptionOrder(newOptionOrder);
            } else {
                throw new Error('Call not found');
            }
        } else {
            const put = optionChain.puts.find(put => put.strike === strike);
            if (put) {
                const newOptionOrder = { ...optionOrder, option: put };
                console.log('newOptionOrder', newOptionOrder);
                setCurrentOptionOrder(newOptionOrder);
            } else {
                throw new Error('Put not found');
            }
        }
    }, [optionChain]);

    // Clear Stock Data & Option Chain
    const clearStockData = useCallback((): void => {
        setCurrentStock(undefined);
        setOptionExpirationDates([]);
        setOptionChain(undefined);
    }, []);

    // Fetch Data
    const fetchData = useCallback(async (listOnly: boolean, symbol?: string, expirationDate?: string, nearPrice?: number, totalStrikes?: 1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40): Promise<void> => {
        setIsLoading(true);
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel('Request Timed Out');
        }, 12000);

        try {
            const response = await axios.get(`${url}data`, {
                params: { expirationDate, symbol },
                cancelToken: source.token
            });

            clearTimeout(timeout);
            const indexesData: StockType[] = Object.values(response.data.indexes);
            // const popularData: StockType[] = Object.values(response.data.popular);
            // const watchData: StockType[] = Object.values(response.data.popular);
            setIndexesList(indexesData);
            setPopularList([]);
            setWatchList([]);

            if (listOnly) {
                return;
            }

            const optionDates: string[] = response.data.dates;
            const calls: OptionType[] = response.data.calls;
            let puts: OptionType[] = response.data.puts;
            const strikes: number[] = response.data.strikes;

            let displayStrikes;
            let price;

            // Ensure puts array is of the same length as calls
            if (puts.length > calls.length) {
                puts = puts.slice(0, calls.length);
            } else if (puts.length < calls.length) {
                puts = [...puts, ...Array(calls.length - puts.length).fill(null)];
            }

            // Set Current Stock Data
            setCurrentStock(response.data.info);
            // Set Option Expiration Dates
            setOptionExpirationDates(optionDates);

            // Set Current Expiration Date
            if (expirationDate) {
                setCurrentExpirationDate(expirationDate);
            } else {
                setCurrentExpirationDate(response.data.dates[0] || '');
            }

            // Set Current Near Price
            if (nearPrice) {
                setCurrentNearPrice(nearPrice);
                price = nearPrice;
            } else {
                setCurrentNearPrice(response.data.info.regularMarketPrice || 0);
                price = response.data.info.regularMarketPrice || 0;
            }

            // Set Total Strikes To Display
            if (totalStrikes) {
                setTotalStrikesToDisplay(totalStrikes);
                displayStrikes = totalStrikes;
            } else {
                // Don't Set Total Strikes To Display, Here We Set The Default Value
                displayStrikes = totalStrikesToDisplay;
            }

            // Set Option Chain Data
            const optionChainData = {
                calls,
                puts,
                strikes,
            };

            if (displayStrikes === 1) {
                // Display All Strikes
                setOptionChain(optionChainData);
            } else {
                let endIndex;
                let startIndex;
                // let closestIndex = strikes.findIndex(strike => strike.strike >= price);
                let closestIndex = strikes.findIndex(strike => strike >= price);

                if (closestIndex === -1) {
                    closestIndex = strikes.length - 1;
                }

                const halfDisplay = Math.floor(displayStrikes / 2);
                const indexesElementsAbove = (strikes.length - 1) - closestIndex;
                const indexesElementsBelow = (strikes.length - 1) - indexesElementsAbove;

                if (indexesElementsAbove < halfDisplay) {
                    startIndex = strikes.length - displayStrikes;
                    endIndex = strikes.length;
                } else if (indexesElementsBelow < halfDisplay) {
                    startIndex = 0;
                    endIndex = displayStrikes;
                } else {
                    startIndex = closestIndex - halfDisplay;
                    endIndex = closestIndex + halfDisplay;
                }

                const filteredOptionChainData = {
                    calls: calls.slice(startIndex, endIndex),
                    puts: puts.slice(startIndex, endIndex),
                    strikes: strikes.slice(startIndex, endIndex),
                };
                setOptionChain(filteredOptionChainData);
            }

            // Handle Recent Searches
            handleRecentSearches(symbol || '');
        } catch (error) {
            if (axios.isCancel(error)) {
                setInfo('Request timed out');
            } else {
                handleError("Could not fetch stock data. Please check the symbol and try again");
            }
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, url, handleRecentSearches, setInfo, totalStrikesToDisplay, handleError]);

    // Load CSV files when the component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                await fetchData(true);
                // await fetchNewsData();
                // await loadCSVFiles();
            } catch (error) {
                handleError(error);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [
        fetchData, handleError, setIsLoading,]);

    const contextValue = useMemo(() => ({
        currentNearPrice,
        currentOption,
        currentOptionOrder,
        currentExpirationDate,
        currentStock,
        modalView,
        indexesList,
        popularList,
        optionChain,
        optionExpirationDates,
        recentSearches,
        totalStrikesToDisplay,
        watchList,
        clearStockData,
        fetchData,
        setCurrentNearPrice,
        setCurrentOption,
        setCurrentOptionOrder,
        setModalView,
        setOptionOrderByStrike,
        setTotalStrikesToDisplay
    }), [
        currentExpirationDate,
        currentNearPrice,
        currentOption,
        currentOptionOrder,
        currentStock,
        modalView,
        indexesList,
        popularList,
        optionChain,
        optionExpirationDates,
        recentSearches,
        totalStrikesToDisplay,
        watchList,
        clearStockData,
        fetchData, 
        setOptionOrderByStrike,
    ]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};