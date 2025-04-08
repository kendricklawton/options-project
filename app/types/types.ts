import { User } from "firebase/auth";

export interface AppContextType {
    currentExpirationDate?: string;
    currentExpirationDates?: string[];
    currentOptionOrder?: OptionOrderType;
    currentStock?: {
        info: InfoType;
        optionChain: OptionChainType;
    };
    modalView: 'account' | 'analytics' | '';
    subscribedMap: Map<string, {
            info: InfoType;
            optionChain: OptionChainType;
    }>;
    clearStockData: () => void;
    fetchStockData: (request: string[]) => Promise<void>;
    setCurrentExpirationDate: (expirationDate: string) => void;
    setCurrentOptionOrder: (order: OptionOrderType) => void;
    setCurrentStock: (stock: {
        info: InfoType;
        optionChain: OptionChainType;
    }) => void;
    setModalView: (view: 'account' | 'analytics' | '') => void;
}

export interface AuthContextType {
    info: string;
    isLoading: boolean;
    user: User | null;
    createUserAccount: (email: string, password: string) => Promise<void>;
    deleteUserAccount: (password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    logInWithGoogle: () => Promise<void>;
    logOut: () => Promise<void>;
    handleSetInfo: (info: string) => void;
    setInfo: (info: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    sendPasswordReset: (email: string) => Promise<void>;
    sendUserVerification: () => Promise<void>;
    updateUserDisplayName: (newDisplayName: string) => Promise<void>;
    updateUserEmail: (newEmail: string, password: string) => Promise<void>;
}

export interface InfoType {
    ask?: number;
    bid?: number;
    country?: string;
    currency?: string;
    currentPrice?: number;
    dayHigh?: number;
    dayLow?: number;
    debtToEquity?: number;
    displayName?: string;
    dividendDate?: number;
    dividendRate?: number;
    dividendYield?: number;
    earningsCallTimestampEnd?: number;
    earningsCallTimestampStart?: number;
    earningsGrowth?: number;
    earningsQuarterlyGrowth?: number;
    earningsTimestamp?: number;
    earningsTimestampEnd?: number;
    earningsTimestampStart?: number;
    // ebitda?: number;
    // ebitdaMargins?: number;
    // enterpriseToEbitda?: number;
    // enterpriseToRevenue?: number;
    // enterpriseValue?: number;
    // epsCurrentYear?: number;
    // epsForward?: number;
    // epsTrailingTwelveMonths?: number;
    // esgPopulated?: boolean;
    exDividendDate?: number;
    // exchange?: string;
    // exchangeDataDelayedBy?: number;
    // exchangeTimezoneName?: string;
    // exchangeTimezoneShortName?: string;
    // fiftyDayAverage?: number;
    // fiftyDayAverageChange?: number;
    // fiftyDayAverageChangePercent?: number;
    // fiftyTwoWeekChangePercent?: number;
    // fiftyTwoWeekHigh?: number;
    // fiftyTwoWeekHighChange?: number;
    // fiftyTwoWeekHighChangePercent?: number;
    // fiftyTwoWeekLow?: number;
    // fiftyTwoWeekLowChange?: number;
    // fiftyTwoWeekLowChangePercent?: number;
    fiftyTwoWeekRange?: string;
    // financialCurrency?: string;
    // firstTradeDateMilliseconds?: number;
    // fiveYearAvgDividendYield?: number;
    // floatShares?: number;
    // forwardEps?: number;
    forwardPE?: number;
    // freeCashflow?: number;
    // fullExchangeName?: string;
    // fullTimeEmployees?: number;
    // gmtOffSetMilliseconds?: number;
    // governanceEpochDate?: number;
    // grossMargins?: number;
    // grossProfits?: number;
    // hasPrePostMarketData?: boolean;
    // heldPercentInsiders?: number;
    // heldPercentInstitutions?: number;
    // impliedSharesOutstanding?: number;
    industry?: string;
    // industryDisp?: string;
    // industryKey?: string;
    // irWebsite?: string;
    isEarningsDateEstimate?: boolean;
    // language?: string;
    lastDividendDate?: number;
    lastDividendValue?: number;
    // lastFiscalYearEnd?: number;
    // lastSplitDate?: number;
    // lastSplitFactor?: string;
    // longBusinessSummary?: string;
    longName?: string;
    market?: string;
    marketCap?: number;
    // marketState?: string;
    // maxAge?: number;
    // messageBoardId?: string;
    // mostRecentQuarter?: number;
    // netIncomeToCommon?: number;
    // nextFiscalYearEnd?: number;
    // numberOfAnalystOpinions?: number;
    // open?: number;
    // operatingCashflow?: number;
    // operatingMargins?: number;
    // overallRisk?: number;
    // payoutRatio?: number;
    // phone?: string;
    // postMarketChange?: number;
    // postMarketChangePercent?: number;
    // postMarketPrice?: number;
    // postMarketTime?: number;
    // previousClose?: number;
    // priceEpsCurrentYear?: number;
    // priceHint?: number;
    priceToBook?: number;
    // priceToSalesTrailing12Months?: number;
    // profitMargins?: number;
    // quickRatio?: number;
    // quoteSourceName?: string;
    // quoteType?: string;
    // recommendationKey?: string;
    // recommendationMean?: number;
    // region?: string;
    regularMarketChange?: number;
    regularMarketChangePercent?: number;
    regularMarketDayHigh?: number;
    regularMarketDayLow?: number;
    regularMarketDayRange?: string;
    regularMarketOpen?: number;
    regularMarketPreviousClose?: number;
    regularMarketPrice?: number;
    regularMarketTime?: number;
    regularMarketVolume?: number;
    // returnOnAssets?: number;
    // returnOnEquity?: number;
    // revenueGrowth?: number;
    // revenuePerShare?: number;
    sector?: string;
    // sectorDisp?: string;
    // sectorKey?: string;
    // shareHolderRightsRisk?: number;
    // sharesOutstanding?: number;
    // sharesPercentSharesOut?: number;
    // sharesShort?: number;
    // sharesShortPreviousMonthDate?: number;
    // sharesShortPriorMonth?: number;
    shortName?: string;
    // shortPercentOfFloat?: number;
    // shortRatio?: number;
    symbol?: string;
    volume?: number;
    website?: string;
}

export interface OptionType {
    ask?: number;
    bid?: number;
    change?: number;
    contractSize?: string;
    contractSymbol?: string;
    currency?: string;
    expiration?: number;
    impliedVolatility?: number;
    inTheMoney?: boolean;
    lastPrice?: number;
    lastTradeDate?: string;
    mark?: number;
    openInterest?: number;
    percentChange?: number;
    strike?: number;
    volume?: number;
}

export interface OptionChainType {
    [date: string]: {
        calls: OptionType[];
        puts: OptionType[];
        strikes: number[];
    }
}

export interface OptionOrderType {
    action: 'buy' | 'sell';
    option: OptionType;
    orderType?: 'limit' | 'market';
    strikes?: number[];
}