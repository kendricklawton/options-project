import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const url = process.env.SERVER_URL as string || '';

// Function to fetch data from the REST API
const restAPIService = async (endpoint: string, params?: object) => {
    // const source = axios.CancelToken.source();
    // const timeout = setTimeout(() => {
    //     source.cancel('Request Timed Out');
    // }, 30000);

    try {
        const response = await axios.get(`${url}/${endpoint}`, {
            params,
            // cancelToken: source.token,
        });
        console.log('REST API Response:', response.data);
        // clearTimeout(timeout);
        return response.data;
    } catch (error) {
        // clearTimeout(timeout);
        throw error;
    }
};

// Rest API Service for Stock Data Two
export const stockDataREST = async (symbols: string[]) => {
    console.log('REST API Request:', symbols);
    return await restAPIService('stock-data', { symbols: symbols });
};

// WebSocket Service for Stock Data
export const stockDataWebSocket = (symbols: string[]) => {
    const socket: Socket = io(`${url}/stock`);

    const onEvent = (callback: (data: Record<string, unknown>) => void) => {
        socket.on('data', (data) => {
            callback(data);
        });
    };
    
    const update = (updateSymbols: string[]) => {
        socket.emit('subscribe', { symbols: updateSymbols });
    };

    const unsubscribe = () => {
        socket.emit('unsubscribe', {});
    };

    socket.on('connect', () => {
        socket.emit('subscribe', { symbols });
    });

    socket.on('connect_error', (error) => {
        console.error('Error connecting to server:', error);
    });

    socket.on('connect_timeout', (timeout) => {
        console.error('Connection timed out:', timeout);
    });

    socket.on('error', (errorData) => {
        console.error('Stock WebSocket Error:', errorData);
    });

    socket.on('message', (message) => {
        console.log('Received Stock Message:', message);
    });

    window.addEventListener('beforeunload', unsubscribe);

    return {
        update,
        unsubscribe,
        onEvent,
    };
};