import { NextResponse, NextRequest } from 'next/server';
import { PredictionServiceClient } from '@google-cloud/aiplatform';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const ENDPOINT_ID = process.env.VERTEX_AI_ENDPOINT_ID;
const LOCATION = process.env.VERTEX_AI_LOCATION;

export async function POST(request: NextRequest) {
    try {
        if (!PROJECT_ID || !ENDPOINT_ID || !LOCATION) {
            throw new Error('Vertex AI environment variables are not set.');
        }

        const clientOptions = {
            apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
        };
        const client = new PredictionServiceClient(clientOptions);

        const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}`;
        const body = await request.json();
        const instances = [body.instances]; // Adapt this to your input data format

        const [response] = await client.predict({
            endpoint,
            instances: instances.map((instance) => ({
                structValue: { fields: instance },
            })),
        });

        return NextResponse.json({ predictions: response.predictions });
    } catch (error) {
        console.error('Vertex AI error:', error);
        return NextResponse.json({ error: error || 'An error occurred' }, { status: 500 });
    }
}