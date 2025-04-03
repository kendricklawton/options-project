import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const url = process.env.SERVER_URL as string || '';

// Function to fetch data from the REST API
const restAPIService = async (endpoint: string, params?: object) => {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
        source.cancel('Request Timed Out');
    }, 8000);

    try {
        const response = await axios.get(`${url}/${endpoint}`, {
            params,
            cancelToken: source.token,
        });
        clearTimeout(timeout);
        if(endpoint === 'stock-data') {
            console.log('Stock REST Data Received: ', response.data);
        } else {
            console.log('Indexes REST Data Received: ', response.data);
        }
        return response.data;
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
};

// Rest API Service for Indexes Data
export const indexesDataREST = async () => {
    return await restAPIService('indexes-data');
};

// Rest API Service for Stock Data
export const stockDataREST = async (symbol: string) => {
    return await restAPIService('stock-data', { symbol });
};

// WebSocket Service for Indexes Data
export const indexesDataWebSocket = () => {
    const socket: Socket = io(`${url}/indexes`);

    const onEvent = (callback: (data: Record<string, unknown>) => void) => {
        socket.on('data', (data) => {
            callback(data);
  
        });
    };

    const unsubscribe = () => {
        socket.emit('unsubscribe', {});
        socket.disconnect();
    };

    socket.on('connect', () => {
        socket.emit('subscribe', {});
    });

    socket.on('connect_error', (error) => {
        console.error('Error connecting to indexes websocker: ', error);
        socket.disconnect();
    });

    socket.on('connect_timeout', (timeout) => {
        console.error('Indexes websocket connection timed out: ', timeout);
        socket.disconnect();
    });

    socket.on('error', (error) => {
        console.error('Indexes websocket error received: ', error);
        socket.disconnect();
    });

    socket.on('message', (message) => {
        console.log('Indexes websocket message received: ', message);
    });

    return {
        unsubscribe,
        onEvent,
    };
};

// WebSocket Service for Stock Data
export const stockDataWebSocket = (symbol: string) => {
    const socket: Socket = io(`${url}/stock`);

    const onEvent = (callback: (data: Record<string, unknown>) => void) => {
        socket.on('data', (data) => {
            callback(data);
            console.log('Stock Websocket Data Received: ', data);
        });
    };

    const unsubscribe = () => {
        socket.emit('unsubscribe', {});
        socket.disconnect();
    };

    socket.on('connect', () => {
        socket.emit('subscribe', { symbol });
    });

    socket.on('connect_error', (error) => {
        console.error('Error connecting to server:', error);
        socket.disconnect();
    });

    socket.on('connect_timeout', (timeout) => {
        console.error('Connection timed out:', timeout);
        socket.disconnect();
    });

    socket.on('error', (errorData) => {
        console.error('Stock WebSocket Error:', errorData);
        socket.disconnect();
    });

    socket.on('message', (message) => {
        console.log('Received Stock Message:', message);
    });

    return {
        unsubscribe,
        onEvent,
    };
};
