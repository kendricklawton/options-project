'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useRef } from 'react';
import { useAuthContext } from './AuthProvider';
import { AppContextType,  OptionChainType, OptionOrderType, OptionType, StockType } from '../types/types';
import {
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
    const [modalView, setModalView] = useState<string>();
    const [expirationDates, setExpirationDates] = useState<string[]>([]);
    const [optionChain, setOptionChain] = useState<OptionChainType>();
    // const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [totalStrikesToDisplay, setTotalStrikesToDisplay] = useState<1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40>(1);
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

            const stockData = data?.info as StockType | undefined;
            setCurrentStock(stockData);
            if (symbol.startsWith('^')) {
                return;
            }
            
            // Parse the data to get the option chain and expiration dates
            const optionChainData: OptionChainType = data.option_chain as OptionChainType;
            const expirationDatesData = Object.keys(optionChainData) as string[];

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
                    const stockData = data?.info as StockType | undefined;
                    setCurrentStock(stockData);
                    if (symbol.startsWith('^')) {
                        return;
                    }

                    const optionChainData: OptionChainType = data.option_chain as OptionChainType;
                    const expirationDatesData = Object.keys(optionChainData) as string[];
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

    const contextValue = useMemo(() => ({
        currentExpirationDate,
        currentOption,
        currentOptionOrder,
        currentStock,
        currentNearPrice,
        currentDisplayStrikes,
        modalView,
        optionChain,
        expirationDates,
        // recentSearches,
        totalStrikesToDisplay,
        clearStockData,
        fetchStockData,
        setCurrentExpirationDate,
        setCurrentNearPrice,
        setCurrentOption,
        setCurrentOptionOrder,
        setCurrentDisplayStrikes,
        setTotalStrikesToDisplay,
        setModalView,
    }), [
        currentExpirationDate,
        currentNearPrice,
        currentOption,
        currentOptionOrder,
        currentStock,
        currentDisplayStrikes,
        modalView,
        optionChain,
        expirationDates,
        // recentSearches,
        totalStrikesToDisplay,
        clearStockData,
        fetchStockData,
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