import Papa, { ParseResult } from 'papaparse';


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


// export const convertUnixTimestamp = (timestamp: number | undefined): string => {
//     if (timestamp == null) return '';

//     const dateObj = new Date(timestamp * 1000);
//     const hours = dateObj.getUTCHours();
//     const minutes = dateObj.getUTCMinutes();
//     const day = dateObj.getUTCDay();

//     // Convert UTC time to Eastern Time (ET)
//     const easternHours = (hours - 5 + 24) % 24; // ET is UTC-5

//     // Check if it's a weekend (Saturday or Sunday) or a holiday
//     if (day === 0 || day === 6 || isHoliday(dateObj)) {
//         return 'US Market Closed';
//     }

//     // Check if the market is open (9:30 AM ET to 4:00 PM ET)
//     if (easternHours < 9 || (easternHours === 9 && minutes < 30) || easternHours >= 16) {
//         return 'US Market Closed';
//     }

//     // Format the time as "as of 12:50 PM ET"
//     const options: Intl.DateTimeFormatOptions = {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true,
//         timeZone: 'America/New_York'
//     };
//     const formattedTime = dateObj.toLocaleTimeString('en-US', options);

//     return `as of ${formattedTime} ET`;
// };

export const convertUnixTimestamp = (timestamp: number | undefined): string => {
    if (timestamp == null) return '';


    const dateObj = new Date(timestamp * 1000);
    // const day = dateObj.getUTCDay();

    // Check if it's a weekend (Saturday or Sunday) or a holiday
    // if (day === 0 || day === 6 || isHoliday(dateObj)) {
    //     return 'US Market Closed';
    // }

    // Convert local time to Eastern Time (ET)
    // const easternOffset = -5 * 60; // ET is UTC-5
    // const localOffset = dateObj.getTimezoneOffset(); // Local time zone offset in minutes
    // const easternTime = new Date(dateObj.getTime() + (localOffset - easternOffset) * 60000);
    // const easternHours = easternTime.getHours();
    // const easternMinutes = easternTime.getMinutes();

    // Check if the market is open (9:30 AM ET to 4:00 PM ET)
    // if (easternHours < 9 || (easternHours === 9 && easternMinutes < 30) || easternHours >= 16) {
    //     return 'US Market Closed';
    // }

    // Format the time as "as of 12:50 PM ET"
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'America/New_York'
    };
    const formattedTime = dateObj.toLocaleTimeString('en-US', options);

    return `as of ${formattedTime} ET`;
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
    const currentYear = new Date().getFullYear();

    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        timeZone: "UTC"
    };

    if (dateObj.getFullYear() !== currentYear) {
        options.year = "2-digit";
    }

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