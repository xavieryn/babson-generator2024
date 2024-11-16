import axios, { AxiosResponse } from 'axios';

export interface SightEngineResponse {
    status: string;
    request: {
        id: string;
        timestamp: number;
        operations: number;
    };
    type: {
        ai_generated: number;
    };
    media: {
        id: string;
        uri: string;
    };
}

const apiUser = '527050385';
const apiSecret = 'DpYFg6icij6tCWu9S4HZSJQjnfp3QBzq';
const imageUrl = 'https://ichef.bbci.co.uk/news/640/cpsprodpb/c5a7/live/e96562b0-a41c-11ef-a4fe-a3e9a6c5d640.jpg.webp';


export async function checkImage() {
    try {
        const response: AxiosResponse<SightEngineResponse> = await axios.get('https://api.sightengine.com/1.0/check.json', {
            params: {
                url: imageUrl,
                models: 'genai',
                api_user: apiUser,
                api_secret: apiSecret,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
