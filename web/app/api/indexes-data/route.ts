import { NextResponse } from 'next/server';
import axios from 'axios';

const url = process.env.SERVER_URL as string;

export async function GET() {
    try {
        // Make the API request directly using axios
        const response = await axios.get(`${url}/indexes-data`, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000,
        });

        // Return the response data as JSON
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching indexes data: ', error);
        return NextResponse.json(
            {
                error: error || 'Failed to fetch indexes data',
            },
        );
    }
}