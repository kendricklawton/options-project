// stores/useAppStore.ts
import { create } from 'zustand';
import { stockDataREST, stockDataWebSocket } from '../services/services';
import { InfoType, OptionChainType, OptionOrderType, ProjectType } from '../types/types';

interface AppStore {
    // State
    currentExpirationDate: string | undefined;
    currentExpirationDates: string[];
    currentOptionOrder: OptionOrderType | undefined;
    currentStock: {
        info: InfoType;
        news: unknown[];
        optionChain: OptionChainType;
    } | undefined;
    theme: 'dark mode' | 'light mode' | 'device mode';
    projects: ProjectType[];
    modalView: 'account' | 'snapshot' | '';
    showPageHeaderExt: boolean;
    subscribedMap: Map<string, {
        info: InfoType;
        news: unknown[];
        optionChain: OptionChainType;
    }>;
    // stockWebSocket: {
    //     unsubscribe: () => void;
    //     update: (symbols: string[]) => void;
    //     onEvent: (callback: (data: Record<string, unknown>) => void) => void;
    // } | null;

    // Actions
    createProject: (newProject: ProjectType) => void;
    updateProject: (updatedProject: ProjectType) => void;
    deleteProject: (id: string) => void;
    fetchStockData: (request: string[]) => Promise<void>;
    clearStockData: () => void;
    setCurrentExpirationDate: (date: string) => void;
    setCurrentOptionOrder: (order: OptionOrderType) => void;
    setTheme: (mode: 'dark mode' | 'light mode' | 'device mode') => void;
    setModalView: (view: 'account' | 'snapshot' | '') => void;
    setShowPageHeaderExt: (show: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => {
    // Private variable, not exposed to components
    let stockWebSocket: {
        unsubscribe: () => void;
        update: (symbols: string[]) => void;
        onEvent: (callback: (data: Record<string, unknown>) => void) => void;
    } | null = null;

    return {
        currentExpirationDate: undefined,
        currentExpirationDates: [],
        currentOptionOrder: undefined,
        currentStock: undefined,
        projects: [],
        theme: 'device mode',
        modalView: '',
        showPageHeaderExt: false,
        subscribedMap: new Map(),

        createProject: (newProject) => set((state) => {
            console.log(newProject);
            newProject.id = Date.now().toString();
            return { projects: [...state.projects, newProject] };
        }),

        updateProject: (updatedProject) => {
            console.log(updatedProject);
        },

        deleteProject: (id) => {
            set((state) => {
                const updatedProjects = state.projects.filter((project) => project.id !== id);
                return { projects: updatedProjects };
            });
            console.log(id + ' deleted');
        },

        fetchStockData: async (request) => {
            try {
                console.log(`REST Request - Data Fetching - Timestamp: ${Date.now()} - Request: ${request}`);
                const data = await stockDataREST(request);
                console.log(`REST Request - Data Received - Timestamp: ${Date.now()} - Data: `, data);
                const symbols = Object.keys(data);

                set((state) => {
                    const updatedMap = new Map(state.subscribedMap);

                    symbols
                        .filter((symbol) => data[symbol]?.info && data[symbol]?.option_chain && data[symbol]?.news)
                        .forEach((symbol) => {
                            updatedMap.set(symbol, {
                                info: data[symbol].info,
                                news: data[symbol].news,
                                optionChain: data[symbol].option_chain,
                            });
                        });

                    if (symbols.length === 1) {
                        const stockData = updatedMap.get(symbols[0]);

                        if (stockData) {
                            set({
                                currentStock: {
                                    ...state.currentStock,
                                    info: stockData.info,
                                    optionChain: stockData.optionChain,
                                    news: stockData.news,
                                },
                                currentExpirationDates: Object.keys(stockData.optionChain),
                                currentExpirationDate: Object.keys(stockData.optionChain)[0],
                            });
                        }
                    }

                    return { subscribedMap: updatedMap };
                });

                if (!stockWebSocket) {
                    stockWebSocket = stockDataWebSocket(request);
                    stockWebSocket.onEvent((wsData) => {
                        const data = wsData.data as Record<string, { info: InfoType; option_chain: OptionChainType; news: unknown[] }>;
                        const symbols = Object.keys(data);

                        set((state) => {
                            const updatedMap = new Map(state.subscribedMap);

                            symbols
                                .filter((symbol) => data[symbol]?.info && data[symbol]?.option_chain)
                                .forEach((symbol) => {
                                    updatedMap.set(symbol, {
                                        info: data[symbol].info,
                                        news: data[symbol].news,
                                        optionChain: data[symbol].option_chain,
                                    });
                                });

                            if (symbols.length === 1) {
                                const currentSymbol = symbols[0];
                                const stockData = updatedMap.get(currentSymbol);

                                if (stockData) {
                                    set({
                                        currentStock: {
                                            ...state.currentStock,
                                            info: stockData.info,
                                            optionChain: stockData.optionChain,
                                            news: stockData.news,
                                        },
                                        currentExpirationDates: Object.keys(stockData.optionChain),
                                        currentExpirationDate: Object.keys(stockData.optionChain)[0],
                                    });
                                }
                            }

                            return { subscribedMap: updatedMap };
                        });
                    });
                } else {
                    stockWebSocket.update(symbols);
                }
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        },

        clearStockData: () => {
            set({ currentStock: undefined });
        },

        setCurrentExpirationDate: (date) => set({ currentExpirationDate: date }),
        setCurrentOptionOrder: (order) => set({ currentOptionOrder: order }),
        setTheme: (mode) => set({ theme: mode }),
        setModalView: (view) => set({ modalView: view }),
        setShowPageHeaderExt: (show) => set({ showPageHeaderExt: show }),
    };
});