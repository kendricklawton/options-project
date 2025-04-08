'use client'

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode,
    useRef,
    useEffect,
} from 'react';
import { useAuthContext } from './AuthProvider';
import { AppContextType, InfoType, OptionChainType, OptionOrderType } from '../types/types';
import { stockDataREST, stockDataWebSocket } from '../services/services';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { handleSetInfo } = useAuthContext();

    const [currentExpirationDate, setCurrentExpirationDate] = useState<string>();
    const [currentExpirationDates, setCurrentExpirationDates] = useState<string[]>([]);
    const [currentOptionOrder, setCurrentOptionOrder] = useState<OptionOrderType>();
    const [currentStock, setCurrentStock] = useState<{
        info: InfoType;
        optionChain: OptionChainType;
    }>();
    const [modalView, setModalView] = useState<'account' | 'analytics' | ''>('');
    const [subscribedMap, setSubscribedMap] = useState<Map<
        string, {
            info: InfoType;
            optionChain: OptionChainType
        }
    >>(new Map());

    const stockWebSocketRef = useRef<{
        unsubscribe: () => void;
        update: (symbols: string[]) => void;
        onEvent: (callback: (data: Record<string, unknown>) => void) => void;
    } | null>(null);

    // Clear Stock Data & Option Chain
    const clearStockData = useCallback((): void => {
        setCurrentStock(undefined);
        setSubscribedMap(new Map());
        stockWebSocketRef.current?.unsubscribe();
        stockWebSocketRef.current = null;
    }, []);

    // Fetch Stock Data
    const fetchStockData = useCallback(async (request: string[]): Promise<void> => {
        try {
            const data = await stockDataREST(request);
            // console.log(`REST Request - Data Received - Timestamp: ${Date.now()}`);
            const symbols = Object.keys(data);

            // console.log('REST - Symbols: ', symbols);

            setSubscribedMap((prevMap) => {
                const updatedMap = new Map(prevMap);

                symbols
                    .filter((symbol) => data[symbol]?.info && data[symbol]?.option_chain)
                    .forEach((symbol) => {
                        updatedMap.set(symbol, {
                            info: data[symbol].info,
                            optionChain: data[symbol].option_chain
                        });
                    });

                // console.log('REST - Updated Map: ', updatedMap);

                if (symbols.length === 1) {
                    const currentSymbol = symbols[0];
                    const stockData = updatedMap.get(currentSymbol);
                    // console.log('REST - Stock Data: ', stockData);

                    if (stockData) {
                        setCurrentStock((prevStock) => ({
                            ...prevStock,
                            info: stockData.info,
                            optionChain: stockData.optionChain
                        }) as {
                            info: InfoType;
                            optionChain: OptionChainType;
                        } | undefined
                        );
                        const expirationDates = Object.keys(stockData.optionChain);
                        setCurrentExpirationDates((prevDates) => {
                            const newDates = expirationDates.filter(date => !prevDates.includes(date));
                            return [...prevDates, ...newDates];
                        });

                        setCurrentExpirationDate(expirationDates[0]);
                    }
                }

                return updatedMap;
            });

            if (!stockWebSocketRef.current) {
                stockWebSocketRef.current = stockDataWebSocket(request);
                // console.log(`Creating New WebSocket Connection Ref: ${stockWebSocketRef.current} - Timestamp: ${Date.now()}`);

                stockWebSocketRef.current.onEvent((wsData) => {
                    // console.log(`WebSocket - Data Received - Timestamp: ${Date.now()}`);
                    const data = wsData.data as Record<string, { info: InfoType; option_chain: OptionChainType }>;
                    const symbols = Object.keys(data);

                    // console.log('WebSocket - Symbols: ', symbols);

                    setSubscribedMap((prevMap) => {
                        const updatedMap = new Map(prevMap);

                        symbols
                            .filter((symbol) => data[symbol]?.info && data[symbol]?.option_chain)
                            .forEach((symbol) => {
                                updatedMap.set(symbol, {
                                    info: data[symbol].info,
                                    optionChain: data[symbol].option_chain
                                });
                            });

                        // console.log('WebSocket - Updated Map: ', updatedMap);

                        const currentSymbol = symbols[4];
                        const stockData = updatedMap.get(currentSymbol);
                        // console.log('WebSocket - Stock Data: ', stockData);

                        if (stockData) {
                            setCurrentStock((prevStock) => ({
                                ...prevStock,
                                info: stockData.info,
                                optionChain: stockData.optionChain
                            }) as {
                                info: InfoType;
                                optionChain: OptionChainType;
                            } | undefined
                            );
                            const expirationDates = Object.keys(stockData.optionChain);
                            setCurrentExpirationDates((prevDates) => {
                                const newDates = expirationDates.filter(date => !prevDates.includes(date));
                                return [...prevDates, ...newDates];
                            });
                        }

                        return updatedMap;
                    });
                });
            } else {
                stockWebSocketRef.current.update(symbols);
                // console.log(`Updating WebSocket Connection Ref: ${stockWebSocketRef} - Timestamp: ${Date.now()} - fetchStockData`);
            }
        } catch (error) {
            handleSetInfo('Server Issues: ' + error);
            throw error;
        }
    }, [handleSetInfo]);


    // Fetch index data and setup WebSocket on mount
    useEffect(() => {
        const awaitData = async () => {
            try {
                await fetchStockData([
                    '^VIX',
                    '^GSPC',
                    '^DJI',
                    '^IXIC',
                ]);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        const handleBeforeUnload = () => {
            stockWebSocketRef.current?.unsubscribe();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        awaitData();

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            stockWebSocketRef.current?.unsubscribe();
        };
    }, [fetchStockData]);

    const contextValue = useMemo(() => ({
        currentExpirationDate,
        currentExpirationDates,
        currentOptionOrder,
        currentStock,
        modalView,
        subscribedMap,
        clearStockData,
        fetchStockData,
        setCurrentExpirationDate,
        setCurrentOptionOrder,
        setCurrentStock,
        setModalView,
    }), [
        currentExpirationDate,
        currentExpirationDates,
        currentOptionOrder,
        currentStock,
        modalView,
        subscribedMap,
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
