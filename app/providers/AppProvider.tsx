'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import { useAuthContext } from './AuthProvider';
import { AppContextType, OptionChainType, OptionOrderType, OptionType, StockType } from '../types/types';
import { indexesDataService, stockDataService } from '../services/services';
// import { loadCSVFiles } from '../utils/utils';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { setIsLoading, setInfo } = useAuthContext();
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [currentExpirationDate, setCurrentExpirationDate] = useState<string>();
    const [currentNearPrice, setCurrentNearPrice] = useState<number>();
    const [currentOption, setCurrentOption] = useState<OptionType>();
    const [currentOptionOrder, setCurrentOptionOrder] = useState<OptionOrderType>();
    const [currentStock, setCurrentStock] = useState<StockType>();
    const [indexesList, setIndexesList] = useState<StockType[]>([]);
    const [modalView, setModalView] = useState<string>('');
    const [optionExpirationDates, setOptionExpirationDates] = useState<string[]>([]);
    const [optionChain, setOptionChain] = useState<OptionChainType>();
    const [totalStrikesToDisplay, setTotalStrikesToDisplay] = useState<1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40>(1);

    // Clear Stock Data & Option Chain
    const clearStockData = useCallback((): void => {
        setCurrentStock(undefined);
        setOptionExpirationDates([]);
        setOptionChain(undefined);
    }, []);

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

    // IN THE FUTURE, WE WILL USE WEB SOCKETS TO UPDATE THE DATA IN REAL TIME INSTEAD OF MAKING A NEW REQUEST

    // Fetch Data
    // const fetchData = useCallback(async (listOnly: boolean, symbol?: string, expirationDate?: string, nearPrice?: number, totalStrikes?: 1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40): Promise<void> => {
    //     setIsLoading(true);
    //     const source = axios.CancelToken.source();
    //     const timeout = setTimeout(() => {
    //         source.cancel('Request Timed Out');
    //     }, 12000);

    //     try {
    //         const response = await axios.get(`${url}stock-data`, {
    //             params: { expirationDate, symbol },
    //             cancelToken: source.token
    //         });

    //         clearTimeout(timeout);
    //         const indexesData: StockType[] = Object.values(response.data.indexes);
    //         setIndexesList(indexesData);

    //         if (listOnly) {
    //             return;
    //         }

    //         const optionDates: string[] = response.data.dates;
    //         const calls: OptionType[] = response.data.calls;
    //         let puts: OptionType[] = response.data.puts;
    //         const strikes: number[] = response.data.strikes;

    //         let displayStrikes;
    //         let price;

    //         // Ensure puts array is of the same length as calls
    //         if (puts.length > calls.length) {
    //             puts = puts.slice(0, calls.length);
    //         } else if (puts.length < calls.length) {
    //             puts = [...puts, ...Array(calls.length - puts.length).fill(null)];
    //         }

    //         // Set Current Stock Data
    //         setCurrentStock(response.data.info);
    //         // Set Option Expiration Dates
    //         setOptionExpirationDates(optionDates);

    //         // Set Current Expiration Date
    //         if (expirationDate) {
    //             setCurrentExpirationDate(expirationDate);
    //         } else {
    //             setCurrentExpirationDate(response.data.dates[0] || '');
    //         }

    //         // Set Current Near Price
    //         if (nearPrice) {
    //             setCurrentNearPrice(nearPrice);
    //             price = nearPrice;
    //         } else {
    //             setCurrentNearPrice(response.data.info.regularMarketPrice || 0);
    //             price = response.data.info.regularMarketPrice || 0;
    //         }

    //         // Set Total Strikes To Display
    //         if (totalStrikes) {
    //             setTotalStrikesToDisplay(totalStrikes);
    //             displayStrikes = totalStrikes;
    //         } else {
    //             // Don't Set Total Strikes To Display, Here We Set The Default Value
    //             displayStrikes = totalStrikesToDisplay;
    //         }

    //         // Set Option Chain Data
    //         const optionChainData = {
    //             calls,
    //             puts,
    //             strikes,
    //         };

    //         if (displayStrikes === 1) {
    //             // Display All Strikes
    //             setOptionChain(optionChainData);
    //         } else {
    //             let endIndex;
    //             let startIndex;
    //             // let closestIndex = strikes.findIndex(strike => strike.strike >= price);
    //             let closestIndex = strikes.findIndex(strike => strike >= price);

    //             if (closestIndex === -1) {
    //                 closestIndex = strikes.length - 1;
    //             }

    //             const halfDisplay = Math.floor(displayStrikes / 2);
    //             const indexesElementsAbove = (strikes.length - 1) - closestIndex;
    //             const indexesElementsBelow = (strikes.length - 1) - indexesElementsAbove;

    //             if (indexesElementsAbove < halfDisplay) {
    //                 startIndex = strikes.length - displayStrikes;
    //                 endIndex = strikes.length;
    //             } else if (indexesElementsBelow < halfDisplay) {
    //                 startIndex = 0;
    //                 endIndex = displayStrikes;
    //             } else {
    //                 startIndex = closestIndex - halfDisplay;
    //                 endIndex = closestIndex + halfDisplay;
    //             }

    //             const filteredOptionChainData = {
    //                 calls: calls.slice(startIndex, endIndex),
    //                 puts: puts.slice(startIndex, endIndex),
    //                 strikes: strikes.slice(startIndex, endIndex),
    //             };
    //             setOptionChain(filteredOptionChainData);
    //         }

    //         // Handle Recent Searches
    //         handleRecentSearches(symbol || '');
    //     } catch (error) {
    //         if (axios.isCancel(error)) {
    //             setInfo('Request timed out');
    //         } else {
    //             handleError("Could not fetch stock data. Please check the symbol and try again");
    //         }
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [setIsLoading, url, handleRecentSearches, setInfo, totalStrikesToDisplay, handleError]);

    // Fetch Indexes Data
    const fetchIndexesData = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const data = await indexesDataService();
            const indexesListData: StockType[] = Object.values(data);
            setIndexesList(indexesListData);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleError, setIsLoading]);

    // Fetch Stock Data
    const fetchStockData = useCallback(async (symbol: string, expirationDate?: string, nearPrice?: number, totalStrikes?: 1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40): Promise<void> => {
        setIsLoading(true);
        try {
            const data = await stockDataService(symbol, expirationDate, nearPrice, totalStrikes);
            console.log('stockData', data);
            const optionDates: string[] = data.dates;
            const calls: OptionType[] = data.calls;
            let puts: OptionType[] = data.puts;
            const strikes: number[] = data.strikes;

            let displayStrikes;
            let price;

            // Ensure puts array is of the same length as calls
            if (puts.length > calls.length) {
                puts = puts.slice(0, calls.length);
            } else if (puts.length < calls.length) {
                puts = [...puts, ...Array(calls.length - puts.length).fill(null)];
            }

            // Set Current Stock Data
            setCurrentStock(data.info);
            // Set Option Expiration Dates
            setOptionExpirationDates(optionDates);

            // Set Current Expiration Date
            if (expirationDate) {
                setCurrentExpirationDate(expirationDate);
            } else {
                setCurrentExpirationDate(data.dates[0] || '');
            }

            // Set Current Near Price
            if (nearPrice) {
                setCurrentNearPrice(nearPrice);
                price = nearPrice;
            } else {
                setCurrentNearPrice(data.info.regularMarketPrice || 0);
                price = data.info.regularMarketPrice || 0;
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
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleError, handleRecentSearches, setIsLoading, totalStrikesToDisplay]);

    // Handle Set Option Order By Strike
    const updateOptionOrderByStrike = useCallback((strike: number, optionOrder: OptionOrderType, optionType: 'Call' | 'Put'): void => {
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

    // Handle Set Option Order By Quantity
    const updateOptionOrderByQuantity = useCallback((quantity: number, optionOrder: OptionOrderType): void => {
        if (quantity < 1) {
            return;
        }

        if (!optionOrder.option) {
            return;
        }
        const newOptionOrder = { ...optionOrder, quantity };
        setCurrentOptionOrder(newOptionOrder);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await fetchIndexesData();
        };

        loadData();
    }, [fetchIndexesData]);

    const contextValue = useMemo(() => ({
        currentNearPrice,
        currentOption,
        currentOptionOrder,
        currentExpirationDate,
        currentStock,
        modalView,
        indexesList,
        optionChain,
        optionExpirationDates,
        recentSearches,
        totalStrikesToDisplay,
        clearStockData,
        fetchIndexesData,
        fetchStockData,
        setCurrentNearPrice,
        setCurrentOption,
        setCurrentOptionOrder,
        setModalView,
        updateOptionOrderByStrike,
        updateOptionOrderByQuantity,
        setTotalStrikesToDisplay
    }), [
        currentExpirationDate,
        currentNearPrice,
        currentOption,
        currentOptionOrder,
        currentStock,
        modalView,
        indexesList,
        optionChain,
        optionExpirationDates,
        recentSearches,
        totalStrikesToDisplay,
        clearStockData,
        fetchIndexesData,
        fetchStockData,
        updateOptionOrderByStrike,
        updateOptionOrderByQuantity,
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