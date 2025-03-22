import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const getMatchScoreCard = (req, res) => {
  const { matchId } = req.params; // Dynamic match ID

  if (!matchId) {
    return res.status(400).json({message: 'matchId required'})
  }

  const options = {
    method: 'GET',
    hostname: 'cricbuzz-cricket.p.rapidapi.com',
    port: null,
    path: `/mcenter/v1/${matchId}/scard`,
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
      try {
        res.status(200).json(JSON.parse(body));
      } catch (error) {
        console.error('Error parsing response:', error);
        res.status(500).json({ error: 'Failed to parse data' });
      }
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  });

  request.end();
};

export default getMatchScoreCard