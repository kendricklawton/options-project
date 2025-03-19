import axios from 'axios';

const url = process.env.SERVER_URL as string || '';

const dataService = async (endpoint: string, params?: object) => {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
        source.cancel('Request Timed Out');
    }, 10000);

    try {
        const response = await axios.get(`${url}${endpoint}`, {
            params,
            cancelToken: source.token
        });
        clearTimeout(timeout);
        console.log(response.data);
        return response.data;
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
};

export const indexesDataService = async () => {
    return await dataService('indexes-data');
};

export const stockDataService = async (symbol: string, expirationDate?: string, nearPrice?: number, totalStrikes?: 1 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 40) => {
    return await dataService('stock-data', { symbol, expirationDate, nearPrice, totalStrikes });
};