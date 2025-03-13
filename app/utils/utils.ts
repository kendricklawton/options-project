import Papa, { ParseResult } from 'papaparse';

// Store the symbols from both CSV files
let file1Symbols: Set<string> = new Set();
let file2Symbols: Set<string> = new Set();

// Define the structure of a CSV row (assuming the first column is 'symbol')
interface SymbolRow {
    symbol: string;
}

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
