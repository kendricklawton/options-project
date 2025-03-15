'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import axios from 'axios';

import { useAuthContext } from './AuthProvider';
import { AppContextType, OptionChainType, OptionType, StockType, 
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
    const [currentNearPrice, setCurrentNearPrice] = useState<number>();
    const [currentStock, setCurrentStock] = useState<StockType>();
    const [totalStrikesToDisplay, setTotalStrikesToDisplay] = useState<1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40>(1);
    const [currentExpirationDate, setCurrentExpirationDate] = useState<string>();
    const [isPageExt, setIsPageExt] = useState<boolean>(false);
    const [optionExpirationDates, setOptionExpirationDates] = useState<string[]>([]);
    const [modalView, setModalView] = useState<string>('');
    const [optionChain, setOptionChain] = useState<OptionChainType>();
    const [watchList, setWatchList] = useState<StockType[]>([]);
    const [indexesList, setIndexesList] = useState<StockType[]>([]);

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

    const handleIsPageExt = useCallback(() => {
        setIsPageExt(prev => !prev);
    }, [setIsPageExt]);

    // Clear Stock Data & Option Chain
    const clearStockData = useCallback((): void => {
        setCurrentStock(undefined);
        setOptionExpirationDates([]);
        setOptionChain(undefined);
    }, []);

    // Fetch News Data
    const fetchNewsData = useCallback(async (): Promise<void> => {
        console.log('Fetching News Data');
        setIsLoading(true);
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel('Request Timed Out');
        }, 12000);

        try {
            const response = await axios.get(`${url}news-data`, {
                cancelToken: source.token
            });

            clearTimeout(timeout);
            console.log(response.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                setInfo('Request timed out');
            } else {
                handleError(error);
            }
        } finally {
            setIsLoading(false);
        }

    }, [handleError, setInfo, setIsLoading, url]);

    // Fetch Indexes Data
    const fetchIndexesData = useCallback(async (): Promise<void> => {
        console.log('Fetching Indexes Data');
        setIsLoading(true);
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel('Request Timed Out');
        }, 12000);

        try {
            const response = await axios.get(`${url}indexes-data`, {
                cancelToken: source.token
            });

            clearTimeout(timeout);
            console.log(response.data);

            const indexesData: StockType[] = Object.values(response.data);
            setIndexesList(indexesData);
        } catch (error) {
            if (axios.isCancel(error)) {
                setInfo('Request timed out');
            } else {
                handleError(error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [handleError, setInfo, setIsLoading, url]);

    // Fetch Stock Data
    const fetchStockData = useCallback(async (symbol: string, expirationDate?: string, nearPrice?: number, totalStrikes?: 1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40): Promise<void> => {
        setIsLoading(true);
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel('Request Timed Out');
        }, 12000);

        try {
            const response = await axios.get(`${url}stock-data`, {
                params: { expirationDate, symbol },
                cancelToken: source.token
            });

            clearTimeout(timeout);
            console.log(response.data);

            // Check if response data is valid
            if (response.data == undefined || response.data.info == undefined || response.data.calls == undefined || response.data.puts == undefined) {
                setInfo('Error fetching data, please try again later');
                return;
            }

            // const stockData: StockType = {
            //     ask: response.data.info?.ask,
            //     bid: response.data.info?.bid,
            //     country: response.data.info?.country,
            //     currency: response.data.info?.currency,
            //     currentPrice: response.data.info?.currentPrice,
            //     dayHigh: response.data.info?.dayHigh,
            //     dayLow: response.data.info?.dayLow,
            //     debtToEquity: response.data.info?.debtToEquity,
            //     displayName: response.data.info?.displayName,
            //     dividendDate: response.data.info?.dividendDate,
            //     dividendRate: response.data.info?.dividendRate,
            //     dividendYield: response.data.info?.dividendYield,
            //     earningsCallTimestampEnd: response.data.info?.earningsCallTimestampEnd,
            //     earningsCallTimestampStart: response.data.info?.earningsCallTimestampStart,
            //     earningsGrowth: response.data.info?.earningsGrowth,
            //     earningsQuarterlyGrowth: response.data.info?.earningsQuarterlyGrowth,
            //     earningsTimestamp: response.data.info?.earningsTimestamp,
            //     earningsTimestampEnd: response.data.info?.earningsTimestampEnd,
            //     earningsTimestampStart: response.data.info?.earningsTimestampStart,
            //     exDividendDate: response.data.info?.exDividendDate,
            //     fiftyTwoWeekRange: response.data.info?.fiftyTwoWeekRange,
            //     forwardPE: response.data.info?.forwardPE,
            //     industry: response.data.info?.industry,
            //     isEarningsDateEstimate: response.data.info?.isEarningsDateEstimate,
            //     lastDividendDate: response.data.info?.lastDividendDate,
            //     lastDividendValue: response.data.info?.lastDividendValue,
            //     longName: response.data.info?.longName,
            //     market: response.data.info?.market,
            //     marketCap: response.data.info?.marketCap,
            //     priceToBook: response.data.info?.priceToBook,
            //     regularMarketChange: response.data.info?.regularMarketChange,
            //     regularMarketChangePercent: response.data.info?.regularMarketChangePercent,
            //     regularMarketDayHigh: response.data.info?.regularMarketDayHigh,
            //     regularMarketDayLow: response.data.info?.regularMarketDayLow,
            //     regularMarketDayRange: response.data.info?.regularMarketDayRange,
            //     regularMarketOpen: response.data.info?.regularMarketOpen,
            //     regularMarketPreviousClose: response.data.info?.regularMarketPreviousClose,
            //     regularMarketPrice: response.data.info?.regularMarketPrice,
            //     regularMarketTime: response.data.info?.regularMarketTime,
            //     regularMarketVolume: response.data.info?.regularMarketVolume,
            //     sector: response.data.info?.sector,
            //     shortName: response.data.info?.shortName,
            //     symbol: response.data.info?.symbol,
            //     volume: response.data.info?.volume,
            //     website: response.data.info?.website,
            // };

            const optionDates: string[] = response.data.dates;
            const calls: OptionType[] = response.data.calls;
            let puts: OptionType[] = response.data.puts;
            // const strikes: StrikeType[] = response.data.strikes;
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
                console.log('Display All Strikes');
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
            handleRecentSearches(symbol);
        } catch (error) {
            if (axios.isCancel(error)) {
                setInfo('Request timed out');
            } else {
                handleError(error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, url, handleRecentSearches, setInfo, totalStrikesToDisplay, handleError]);

    // Fetch Watch List Data
    const fetchWatchListData = useCallback(async (): Promise<void> => {
        console.log('Fetching Watch List Data');
        if (watchList.length === 0) {
            return;
        }

        setIsLoading(true);

        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel('Request Timed Out');
        }, 12000);
        try {
            const response = await axios.get(`${url}watch-list-data`, {
                params: { watchList },
                cancelToken: source.token
            });
            clearTimeout(timeout);
            console.log(response.data);
            const watchListData: StockType[] = response.data.watchList;
            setWatchList(watchListData);
        } catch (error) {
            if (axios.isCancel(error)) {
                setInfo('Request timed out');
            } else {
                handleError(error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [handleError, setInfo, setIsLoading, url, watchList]);

    // Load CSV files when the component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                await fetchIndexesData();
                // await fetchNewsData();
                // await loadCSVFiles();
                await fetchWatchListData();
            } catch (error) {
                handleError(error);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [fetchNewsData, fetchIndexesData, fetchWatchListData, handleError, setIsLoading,]);

    const contextValue = useMemo(() => ({
        currentNearPrice,
        currentOption,
        currentExpirationDate,
        currentStock,
        modalView,
        indexesList,
        isPageExt,
        optionChain,
        optionExpirationDates,
        recentSearches,
        totalStrikesToDisplay,
        watchList,
        clearStockData,
        fetchStockData,
        fetchWatchListData,
        handleIsPageExt,
        setCurrentOption,
        setCurrentNearPrice,
        setModalView,
        setTotalStrikesToDisplay
    }), [
        currentNearPrice,
        currentOption,
        currentExpirationDate,
        currentStock,
        modalView,
        indexesList,
        isPageExt,
        optionChain,
        optionExpirationDates,
        recentSearches,
        totalStrikesToDisplay,
        watchList,
        clearStockData,
        fetchStockData,
        fetchWatchListData,
        handleIsPageExt,
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