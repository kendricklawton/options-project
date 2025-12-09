import Papa, { ParseResult } from 'papaparse';
import { OptionChainType, OptionType } from '@/app/types/types';

// Store the symbols from both CSV files
let file1Symbols: Set<string> = new Set();
let file2Symbols: Set<string> = new Set();

// Define the structure of a CSV row (assuming the first column is 'symbol')
interface SymbolRow {
    symbol: string;
}

const holidays = [
    '2025-01-01', // New Year's Day
    '2025-01-20', // Martin Luther King Jr. Day
    '2025-02-17', // Presidents' Day
    '2025-04-18', // Good Friday
    '2025-05-26', // Memorial Day
    '2025-07-04', // Independence Day
    '2025-09-01', // Labor Day
    '2025-11-27', // Thanksgiving Day
    '2025-12-25', // Christmas Day
];

export const convertUnixTimestamp = (timestamp: number | undefined): string => {
    if (timestamp == null) return '';

    const dateObj = new Date(timestamp * 1000);

    // Format the date as "Apr 1"
    const dateOptions: Intl.DateTimeFormatOptions = {
        month: 'short', // Abbreviated month (e.g., "Apr")
        day: 'numeric', // Day of the month (e.g., "1")
        // year: 'numeric', // Full year (e.g., "2025")
        timeZone: 'America/New_York', // Eastern Time Zone
    };
    const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions);

    // Format the time as "4:00 PM"
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'America/New_York', // Eastern Time Zone
    };
    const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);

    // Combine the date and time
    // return `Data as of ${formattedDate}, ${formattedTime} ET`;
    return `${formattedDate}, ${formattedTime} ET`;
};

export const convertUnixTimestampTwo = (timestamp: number | undefined): string => {
    if (timestamp == null) return 'No Date';

    const dateObj = new Date(timestamp * 1000);

    // Convert UTC time to Eastern Time (ET)

    // Format the time as "as of 12:50 PM ET"
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        // hour: 'numeric',
        // minute: 'numeric',
        // hour12: true,
        // timeZone: 'America/New_York'
    };
    // const formattedTime = dateObj.toLocaleTimeString('en-US', options);
    const formattedTime = dateObj.toLocaleDateString('en-US', options)

    return `${formattedTime}`;
};

export const formatDate = (date: string | undefined) => {
    if (date == null) return '';
    const dateObj = new Date(date + 'T00:00:00Z');
    // const currentYear = new Date().getFullYear();

    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        timeZone: "UTC"
    };

    // if (dateObj.getFullYear() !== currentYear) {
    options.year = "2-digit";
    // }

    return dateObj.toLocaleDateString("en-US", options);
};

export const formatMarketCap = (marketCap: number | undefined): string => {
    if (marketCap == null) return '';
    if (marketCap >= 1_000_000_000_000) {
        return `${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (marketCap >= 1_000_000_000) {
        return `${(marketCap / 1_000_000_000).toFixed(2)}B`;
    }
    if (marketCap >= 1_000_000) {
        return `${(marketCap / 1_000_000).toFixed(2)}M`;
    }
    return `${marketCap}`;
};

export const formatPlusMinus = (price: number | undefined): string => {
    if (price == 0 || price == null) return '0.00';
    return price > 0 ? `+${price.toFixed(2)}` : price.toFixed(2);
};

// Function to get filtered symbols based on user input
export const getFilteredSymbols = (input: string): string[] => {
    const lowercasedInput = input.toLowerCase();

    // Filter symbols from both files that start with the input string
    const filteredFile1Symbols = Array.from(file1Symbols).filter(symbol =>
        symbol.toLowerCase().startsWith(lowercasedInput)
    );

    const filteredFile2Symbols = Array.from(file2Symbols).filter(symbol =>
        symbol.toLowerCase().startsWith(lowercasedInput)
    );

    // Combine results from both files
    return [...filteredFile1Symbols, ...filteredFile2Symbols];
};

export const isHoliday = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return holidays.includes(dateString);
};

export const isNumPositive = (num: number) => {
    return num > 0;
};

// Function to load CSV files into memory
export const loadCSVFiles = async () => {
    const file1 = await fetch('/path/to/your/file1.csv');
    const file2 = await fetch('/path/to/your/file2.csv');

    const file1Text = await file1.text();
    const file2Text = await file2.text();

    // Parse the CSV data and populate the sets
    Papa.parse<SymbolRow>(file1Text, {
        complete: (result: ParseResult<SymbolRow>) => {
            // Assuming the symbol is the first column in each row
            const file1Column = result.data.map((row: SymbolRow) => row.symbol);
            file1Symbols = new Set(file1Column.filter(Boolean));
        },
        header: true,
        skipEmptyLines: true,
    });

    Papa.parse<SymbolRow>(file2Text, {
        complete: (result: ParseResult<SymbolRow>) => {
            const file2Column = result.data.map((row: SymbolRow) => row.symbol);
            file2Symbols = new Set(file2Column.filter(Boolean));
        },
        header: true,
        skipEmptyLines: true,
    });
};

const erf = (x: number) => {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
};

const cdf = (x: number) => {
    return (1.0 + erf(x / Math.sqrt(2))) / 2.0;
};

// Function to calculate the Black-Scholes call option price
export const blackScholesCall = (S: number, X: number, T: number, r: number, sigma: number) => {
    const d1 = (Math.log(S / X) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return S * cdf(d1) - X * Math.exp(-r * T) * cdf(d2);
};

// Function to calculate the number of days remaining until the expiration date
export const calculateDaysRemaining = (expirationDate: string | undefined) => {
    if (expirationDate == null) return 0;
    const today = new Date();
    const expiration = new Date(expirationDate);
    const timeDiff = expiration.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
};

// Function to check if the stock market is open
export const stockMarketOpen = (): boolean => {
    return true;
};

// Function to filter the option chain based on the current expiration date, display strikes, and market price
export const getFilteredOptionChain = (
    optionChain: OptionChainType,
    currentExpirationDate: string,
    displayStrikes: number,
    regularMarketPrice: number
) => {
    if (!currentExpirationDate || !optionChain) {
        return null;
    }

    const currentOptionChain = optionChain[currentExpirationDate];
    if (!currentOptionChain) {
        return null;
    }

    const strikes = currentOptionChain.strikes ?? [];
    if (strikes.length < displayStrikes || displayStrikes === 1) {
        return {
            calls: currentOptionChain.calls,
            puts: currentOptionChain.puts,
            strikes: currentOptionChain.strikes,
        };
    }

    const nearPrice = regularMarketPrice;
    let closestIndex = currentOptionChain.strikes.findIndex((strike) => strike >= nearPrice);

    if (closestIndex === -1) {
        closestIndex = currentOptionChain.strikes.length - 1;
    }

    const halfDisplay = Math.floor(displayStrikes / 2);
    const indexesElementsAbove = strikes.length - 1 - closestIndex;
    const indexesElementsBelow = strikes.length - 1 - indexesElementsAbove;

    let startIndex, endIndex;

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

    const filteredOptionChain = {
        calls: currentOptionChain.calls.slice(startIndex, endIndex),
        puts: currentOptionChain.puts.slice(startIndex, endIndex),
        strikes: strikes.slice(startIndex, endIndex),
    };

    return filteredOptionChain;
};

// Function to determine the option cost based on action, option type, and quantity
export const determineOptionCost = (
    action: 'buy' | 'sell' | undefined,
    option: OptionType | undefined,
    quantity: number
) => {
    if (action === 'buy' && option?.ask) {
        return option.ask * (quantity * 100);
    } else if (action === 'sell' && option?.bid) {
        return option.bid * (quantity * 100);
    }
    return 0;
}

// Function to determine the option type (Call or Put) based on the symbol
export const determineOptionType = (symbol: string): 'call' | 'put' | 'n/a' => {
    // Contract symbols can be in various formats, e.g., "AAPL230421C00150000" or "AAPL230421P00150000"
    // The option type will always be the first letter after the first set of digits
    // Example: "AAPL230421C00150000" -> "C" (Call) or "P" (Put)
    for (let i = 0; i < symbol.length - 2; i++) {
        const char = symbol.charAt(i);
        const char2 = symbol.charAt(i + 1);
        const isNum = !isNaN(parseInt(char));

        if (isNum && (char2.toLowerCase() == 'c' || char2.toLowerCase() =='p')) {
           if (char2.toLowerCase() == 'c') {
                return 'call';
            } else if (char2.toLowerCase() == 'p') {
                return 'put';
            }     
        }
    }

    return 'n/a';
};

// Function to determine the expiration date from the symbol
export const determineOptionExpirationDate = (symbol: string): string => {
    // Find the first numeric sequence in the symbol
    const match = symbol.match(/\d+/);
    if (!match) {
        return 'N/A';
    }

    const numericPart = match[0];

    // Ensure the numeric part has at least 6 characters (YYMMDD format)
    if (numericPart.length < 6) {
        return 'N/A';
    }

    // Extract year, month, and day
    const year = `20${numericPart.slice(0, 2)}`; // Add "20" to the year to make it 4 digits
    const month = numericPart.slice(2, 4);
    const day = numericPart.slice(4, 6);

    // Return the formatted expiration date
    return `${year}-${month}-${day}`;
    // const formattedDate = formatDate(`${year}-${month}-${day}`);
    // return formattedDate;
};

// Function to determine the break-even point for an option order
export const determineOptionBreakEven = (
    action: 'buy' | 'sell' | undefined,
    option: OptionType | undefined,
): number => {
    if (action === undefined || option === undefined) {
        return 0;
    }

    const optionPrice = action === 'buy' ? option?.ask : option?.bid;
    const optionType = determineOptionType(option?.contractSymbol || '');
    const strikePrice = option?.strike;

    if (optionPrice === undefined || optionType === null || strikePrice === undefined) {
        return 0;
    }

    if (optionType === 'call') {
        return optionPrice + strikePrice;
    } else if (optionType === 'put') {
        return strikePrice - optionPrice;
    }

    return 0;
}


// Function to determine the maximum loss of an option order
export const determineOptionMaxLoss = (
    action: 'buy' | 'sell' | undefined,
    option: OptionType | undefined,
    quantity: number
): number => {
    if (action === undefined || option === undefined || option?.ask === undefined || option?.bid === undefined || option?.strike === undefined) {
        return 0;
    }

    const optionType = determineOptionType(option?.contractSymbol || '');

    console.log('Option Type: ', optionType);

    if (optionType === 'call') {
        if (action === 'buy') {
            console.log('Max Loss: ', option.ask * (quantity * 100));
            return option.ask * (quantity * 100);
        } else if (action === 'sell') {
            console.log('Max Loss: ', Infinity);
            return Infinity
        }
    }

    if (optionType === 'put') {
        if (action === 'buy') {
            console.log('Max Loss: ', option.ask * (quantity * 100));
            return option.ask * (quantity * 100);
        } else if (action === 'sell') {
            return option.strike * (quantity * 100) - option.bid * (quantity * 100);

        }
    }

    return 0;
}

// Function to determine the maximum profit of an option order
export const determineOptionMaxProfit = (
    action: 'buy' | 'sell' | undefined,
    option: OptionType | undefined,
    quantity: number
): number => {
    if (action === undefined || option === undefined || option?.ask === undefined || option?.bid === undefined || option?.strike === undefined) {
        return 0;
    }

    const optionType = determineOptionType(option?.contractSymbol || '');

    console.log('Option Type: ', optionType);

    if (optionType === 'call') {
        if (action === 'buy') {
            console.log('Max Profit: ', Infinity);
            return Infinity
        } else if (action === 'sell') {
            console.log('Max Profit: ', option.bid * (quantity * 100));
            return option.bid * (quantity * 100);
        }
    }

    if (optionType === 'put') {
        if (action === 'buy') {
            console.log('Max Profit: ', option.strike * (quantity * 100) - option.ask * (quantity * 100));
            return option.strike * (quantity * 100) - option.ask * (quantity * 100);
        } else if (action === 'sell') {
            console.log('Max Profit: ', option.bid * (quantity * 100));
            return option.bid * (quantity * 100);
        }
    }

    return 0;
}