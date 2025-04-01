'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect, useRef } from 'react';
import { useAuthContext } from './AuthProvider';
import { AppContextType,  OptionChainType, OptionOrderType, OptionType, StockType } from '../types/types';
import {
    indexesDataREST,
    indexesDataWebSocket,
    stockDataREST,
    stockDataWebSocket,
} from '../services/services';
import { stockMarketOpen } from '../utils/utils';
// import { isStockMarketOpen } from '../utils/utils';
// import { loadCSVFiles } from '../utils/utils';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { setIsLoading, handleSetInfo } = useAuthContext();
    const [currentDisplayStrikes, setCurrentDisplayStrikes] = useState<1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40>(1);
    const [currentExpirationDate, setCurrentExpirationDate] = useState<string>();
    const [currentNearPrice, setCurrentNearPrice] = useState<number>();
    const [currentOption, setCurrentOption] = useState<OptionType>();
    const [currentOptionOrder, setCurrentOptionOrder] = useState<OptionOrderType>();
    const [currentStock, setCurrentStock] = useState<StockType>();
    const [indexesList, setIndexesList] = useState<StockType[]>([]);
    const [modalView, setModalView] = useState<string>();
    const [expirationDates, setExpirationDates] = useState<string[]>([]);
    const [optionChain, setOptionChain] = useState<OptionChainType>();
    // const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [totalStrikesToDisplay, setTotalStrikesToDisplay] = useState<1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40>(1);
    const indexesWebSocketRef = useRef<{
        unsubscribe: () => void;
        onEvent: (callback: (data: Record<string, unknown>) => void) => void;
    } | null>(null);
    const stockWebSocketRef = useRef<{
        unsubscribe: () => void;
        onEvent: (callback: (data: Record<string, unknown>) => void) => void;
    } | null>(null);

    // Clear Stock Data & Option Chain
    const clearStockData = useCallback((): void => {
        setCurrentStock(undefined);
        setExpirationDates([]);
        setOptionChain(undefined);
    }, []);

    // Handle Search History
    // const handleRecentSearches = useCallback((symbol: string) => {
    //     if (recentSearches.includes(symbol.toLocaleUpperCase())) {
    //         return;
    //     }
    //     const updatedSearches = [symbol.toLocaleUpperCase(), ...recentSearches];
    //     if (updatedSearches.length > 5) {
    //         updatedSearches.pop();
    //     }
    //     setRecentSearches(updatedSearches);
    // }, [recentSearches]);

    // Fetch Indexes Data uses both WebSocket and REST API, If the market is open
    // this method will use WebSocket to get real-time data
    // and if the market is closed it will use REST API to get the data.
    const fetchIndexesData = useCallback(async (): Promise<void> => {
        // setIsLoading(true); // Need To Handle In Header
        try {
            if (indexesWebSocketRef.current) {
                indexesWebSocketRef.current.unsubscribe();
                indexesWebSocketRef.current = null;
            }

            // Fetch initial indexes data
            const data = await indexesDataREST();

            // Parse the data to get the indexes list
            const indexesListData: StockType[] = Object.values(data) as StockType[];

            // Update state with the received data
            setIndexesList(indexesListData);

            // If the market is open, create a new WebSocket connection
            // and listen for data updates
            if (stockMarketOpen()) {
                indexesWebSocketRef.current = indexesDataWebSocket();
                // Listen for data updates
                indexesWebSocketRef.current.onEvent((data) => {
                    const indexesListData: StockType[] = Object.values(data) as StockType[];
                    // Update state with the received data
                    setIndexesList(indexesListData);
                });
  
            }
        } catch (error) {
            handleSetInfo('' + error);
        } finally {
            // setIsLoading(false); // Need To Handle In Header
        }
    }, [handleSetInfo]);

    // Fetch Stock Data also uses both WebSocket and REST API, If the market is open
    // this method will use WebSocket to get real-time data
    // and if the market is closed it will use REST API to get the data. It also calls
    // the REST API to get the initial for a better user experience
    // and to avoid the WebSocket connection delay
    const fetchStockData = useCallback(async (symbol: string): Promise<void> => {
        setIsLoading(true);
        try {
            if (stockWebSocketRef.current) {
                stockWebSocketRef.current.unsubscribe();
                stockWebSocketRef.current = null;
            }

            // Fetch initial stock data
            const data =  await stockDataREST(symbol);
            // Parse the data to get the option chain and expiration dates
            const optionChainData: OptionChainType = data.option_chain as OptionChainType;
            const expirationDatesData = Object.keys(optionChainData) as string[];
            const stockData = data?.info as StockType | undefined;

            // Update state with the received data
            setCurrentStock(stockData);
            setExpirationDates(expirationDatesData);
            setOptionChain(optionChainData);
            setCurrentNearPrice(stockData?.regularMarketPrice || 0);
            if(stockData?.symbol?.toLowerCase() !== currentStock?.symbol?.toLowerCase()) {
                setCurrentExpirationDate(expirationDatesData[0]);
            }

            // If the market is open, create a new WebSocket connection
            // and listen for data updates
            if (stockMarketOpen()) {
                stockWebSocketRef.current = stockDataWebSocket(symbol);

                // Listen for data updates
                stockWebSocketRef.current.onEvent((data) => {
                    const optionChainData: OptionChainType = data.option_chain as OptionChainType;
                    const expirationDatesData = Object.keys(optionChainData) as string[];
                    const stockData = data?.info as StockType | undefined;
                    // Update state with the received data
                    setCurrentStock(stockData);
                    setExpirationDates(expirationDatesData);
                    setOptionChain(optionChainData);
                });
            }
        } catch (error) {
            handleSetInfo('Server Issues, Please Try Again Later');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [currentStock, handleSetInfo, setIsLoading]);

    // Handle Set Option Order By Strike
    const updateOptionOrderByStrike = useCallback((strike: number, optionOrder: OptionOrderType, optionType: 'Call' | 'Put'): void => {
        if (!optionChain) {
            return;
        }
        if (optionOrder.option?.strike === strike) {
            return;
        }
        if (optionType === 'Call') {
            // const call = optionChain.calls.find(call => call.strike === strike);
            // if (call) {
            //     const newOptionOrder = { ...optionOrder, option: call };
            //     setCurrentOptionOrder(newOptionOrder);
            // } else {
            //     throw new Error('Call not found');
            // }
        } else {
            // const put = optionChain.puts.find(put => put.strike === strike);
            // if (put) {
            //     const newOptionOrder = { ...optionOrder, option: put };
            //     setCurrentOptionOrder(newOptionOrder);
            // } else {
            //     throw new Error('Put not found');
            // }
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

    // Fetch Indexes Data on Component Mount
    useEffect(() => {
        const awaitData = async () => {
                await fetchIndexesData();
        };

        awaitData();
    }, [fetchIndexesData]);

    const contextValue = useMemo(() => ({
        currentExpirationDate,
        currentOption,
        currentOptionOrder,
        currentStock,
        currentNearPrice,
        currentDisplayStrikes,
        modalView,
        indexesList,
        optionChain,
        expirationDates,
        // recentSearches,
        totalStrikesToDisplay,
        clearStockData,
        fetchIndexesData,
        fetchStockData,
        setCurrentExpirationDate,
        setCurrentNearPrice,
        setCurrentOption,
        setCurrentOptionOrder,
        setCurrentDisplayStrikes,
        setTotalStrikesToDisplay,
        setModalView,
        updateOptionOrderByStrike,
        updateOptionOrderByQuantity,
    }), [
        currentExpirationDate,
        currentNearPrice,
        currentOption,
        currentOptionOrder,
        currentStock,
        currentDisplayStrikes,
        modalView,
        indexesList,
        optionChain,
        expirationDates,
        // recentSearches,
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