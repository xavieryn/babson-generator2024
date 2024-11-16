import axios, { AxiosResponse } from 'axios';
import { SightEngineResponse } from './type';


const apiUser = '527050385';
const apiSecret = 'DpYFg6icij6tCWu9S4HZSJQjnfp3QBzq';
const imageUrl = 'https://images.deepai.org/machine-learning-models/b6dcce965af54c26918924813f3cd288/cyborg.jpg';


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
