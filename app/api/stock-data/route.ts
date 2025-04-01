import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

const url = process.env.SERVER_URL as string;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(`${url}/stock-data`, { params: { symbol } });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return NextResponse.json({ error: error || 'Failed to fetch stock data' }, { status: 500 });
    }
}