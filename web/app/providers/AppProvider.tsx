'use client'

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode,
    useRef,
    // useEffect,
} from 'react';
import { useAuthContext } from './AuthProvider';
import { AppContextType, InfoType, OptionChainType, OptionOrderType, ProjectType } from '../types/types';
import { stockDataREST, 
    stockDataWebSocket
 } from '../services/services';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { handleSetInfo } = useAuthContext();

    const [currentExpirationDate, setCurrentExpirationDate] = useState<string>();
    const [currentExpirationDates, setCurrentExpirationDates] = useState<string[]>([]);
    const [currentOptionOrder, setCurrentOptionOrder] = useState<OptionOrderType>();
    const [currentStock, setCurrentStock] = useState<{
        info: InfoType;
        optionChain: OptionChainType;
        news: unknown[];
    }>();
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [modalView, setModalView] = useState<'account' | 'snapshot' | ''>('');
    const [showPageHeaderExt, setShowPageHeaderExt] = useState<boolean>(false);
    const [subscribedMap, setSubscribedMap] = useState<Map<
        string, {
            info: InfoType;
            news: unknown[];
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
        stockWebSocketRef.current?.unsubscribe();
        stockWebSocketRef.current = null;
    }, []);

    const createProject = useCallback(async(newProject: ProjectType) => {
        newProject.id = Date.now().toString();
        setProjects([
            ...projects,
            newProject
        ])
    }, [projects]);

    const updateProject = useCallback(async(updatedProject: ProjectType) => {
        console.log(updatedProject);
    }, []);

    const deleteProject = useCallback(async(id: string) => {
        console.log(id);
    }, []);


    // Fetch Stock Data
    const fetchStockData = useCallback(async (request: string[]): Promise<void> => {
        try {
            console.log(`REST Request - Data Fetching - Timestamp: ${Date.now()} - Request: ${request}`);
            const data = await stockDataREST(request);
            console.log(`REST Request - Data Received - Timestamp: ${Date.now()} - Data: `, data);
            // console.log(`REST Request - Data Received - Timestamp: ${Date.now()}`);
            const symbols = Object.keys(data);

            // console.log('REST - Symbols: ', symbols);

            setSubscribedMap((prevMap) => {
                const updatedMap = new Map(prevMap);

                symbols
                    .filter((symbol) => data[symbol]?.info && data[symbol]?.option_chain && data[symbol]?.news)
                    .forEach((symbol) => {
                        updatedMap.set(symbol, {
                            info: data[symbol].info,
                            news: data[symbol].news,
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
                            optionChain: stockData.optionChain,
                            news: stockData.news
                        }) as {
                            info: InfoType;
                            optionChain: OptionChainType;
                            news: unknown[];
                        } | undefined
                        );

                        if (stockData.optionChain !== undefined) {
                            const expirationDates = Object.keys(stockData.optionChain);
                            console.log('Expiration Dates: ', expirationDates);
                            setCurrentExpirationDates(expirationDates);
                            setCurrentExpirationDate(expirationDates[0]);
                        } else {
                            console.log('No option chain data available for the current stock');
                            setCurrentExpirationDates([])
                            setCurrentExpirationDate(undefined);
                        }
                    }
                }

                return updatedMap;
            });

            if (!stockWebSocketRef.current) {
                stockWebSocketRef.current = stockDataWebSocket(request);
                // console.log(`Creating New WebSocket Connection Ref: ${stockWebSocketRef.current} - Timestamp: ${Date.now()}`);

                stockWebSocketRef.current.onEvent((wsData) => {
                    // console.log(`WebSocket - Data Received - Timestamp: ${Date.now()}`);
                    const data = wsData.data as Record<string, { info: InfoType; option_chain: OptionChainType; news: unknown[] }>;
                    const symbols = Object.keys(data);

                    // console.log('WebSocket - Symbols: ', symbols);

                    setSubscribedMap((prevMap) => {
                        console.log('WebSocket - Previous Map: ', prevMap);
                        const updatedMap = new Map(prevMap);

                        symbols
                            .filter((symbol) => data[symbol]?.info && data[symbol]?.option_chain)
                            .forEach((symbol) => {
                                updatedMap.set(symbol, {
                                    info: data[symbol].info,
                                    news: data[symbol].news,
                                    optionChain: data[symbol].option_chain
                                });
                            });

                        // console.log('WebSocket - Updated Map: ', updatedMap);

                        const currentSymbol = symbols[5];
                        const stockData = updatedMap.get(currentSymbol);
                        // console.log('WebSocket - Stock Data: ', stockData);

                        if (stockData) {
                            setCurrentStock((prevStock) => ({
                                ...prevStock,
                                info: stockData.info,
                                optionChain: stockData.optionChain,
                                news: stockData.news
                            }) as {
                                info: InfoType;
                                optionChain: OptionChainType;
                                news: unknown[];
                            } | undefined
                            );
                            
                            if (stockData.optionChain !== undefined) {
                                const expirationDates = Object.keys(stockData.optionChain);
                                console.log('Expiration Dates: ', expirationDates);
                                setCurrentExpirationDates(expirationDates);
                                setCurrentExpirationDate(expirationDates[0]);
                            } else {
                                console.log('No option chain data available for the current stock');
                                setCurrentExpirationDates([])
                                setCurrentExpirationDate(undefined);
                            }
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
    // useEffect(() => {
    //     const awaitData = async () => {
    //         try {
    //             await fetchStockData([
    //                 '^VIX',
    //                 '^GSPC',
    //                 '^DJI',
    //                 '^IXIC',
    //                 '^RUT',
    //             ]);
    //         } catch (error) {
    //             console.error('Error fetching stock data:', error);
    //         }
    //     };

    //     const handleBeforeUnload = () => {
    //         stockWebSocketRef.current?.unsubscribe();
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     awaitData();

    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //         stockWebSocketRef.current?.unsubscribe();
    //     };
    // }, [fetchStockData]);

    const contextValue = useMemo(() => ({
        currentExpirationDate,
        currentExpirationDates,
        currentOptionOrder,
        currentStock,
        modalView,
        projects,
        subscribedMap,
        showPageHeaderExt,
        createProject,
        deleteProject,
        updateProject,
        clearStockData,
        fetchStockData,
        setCurrentExpirationDate,
        setCurrentOptionOrder,
        setModalView,
        setShowPageHeaderExt

    }), [
        currentExpirationDate,
        currentExpirationDates,
        currentOptionOrder,
        currentStock,
        modalView,
        projects,
        showPageHeaderExt,
        subscribedMap,
        createProject,
        deleteProject,
        updateProject,
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
