'use server';
import axios from 'axios';
import Cookie from 'universal-cookie';

export default async function getSpeechToken() {
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token');
    const speechRegion = process.env.SPEECH_REGION;
    if (speechToken === undefined) {
        const speechKey = process.env.SPEECH_KEY;
        if (!speechKey  || !speechRegion) {
            console.error('You forgot to add your speech key or region to the .env file.');
        } else {
            const headers = { 
                headers: {
                    'Ocp-Apim-Subscription-Key': speechKey,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            try {
                const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
                cookie.set('speech-token', tokenResponse.data, {maxAge: 540, path: '/'});
                return { authToken: tokenResponse.data, region: speechRegion };
                //res.send({ token: tokenResponse.data, region: speechRegion });
            } catch (err) {
                console.error('There was an error authorizing your speech key.');
            }
        }
    } else {
        console.log('Using cached speech token');
        return { authToken: speechToken, region: speechRegion! };
    }
};