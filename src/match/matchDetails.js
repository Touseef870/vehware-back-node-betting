// import axios from 'axios';

// export default async function handleMatchDetails(req, res) {
//     const { matchId } = req.query;

//     if (!matchId) {
//         return res.status(400).json({ error: "Match ID is required." });
//     }

//     const API_URL = `https://cricket-live-data.p.rapidapi.com/match/${matchId}`;

//     try {
//         console.log('Headers:', {
//             'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//             'x-rapidapi-host': 'cricket-live-data.p.rapidapi.com'
//         });

//         const response = await axios.get(API_URL, {
//             headers: {
//                 'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//                 'x-rapidapi-host': 'cricket-live-data.p.rapidapi.com'
//             }
//         });

//         // if (!response.data || !response.data.results) {
//         //     return res.status(404).json({ error: "Match data not found." });
//         // }

//         res.status(200).json(response);
//     } catch (error) {
//         console.error('Error fetching match details:', error.message);
//         res.status(500).json({ error: error.message });
//     }
// }

import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

export default async function getMatchDetails(req, res) {
    const { matchId } = req.query;

    const options = {
        method: 'GET',
        hostname: 'cricbuzz-cricket.p.rapidapi.com',
        port: null,
        path: `/mcenter/v1/${matchId || 41881}`,
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
        },
    };

    const request = https.request(options, (response) => {
        const chunks = [];

        response.on('data', (chunk) => chunks.push(chunk));

        response.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            res.status(200).json(JSON.parse(body));
        });
    });

    request.on('error', (error) => {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    });

    request.end();
};
