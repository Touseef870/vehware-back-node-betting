import Response from '../../../../class/response.js';
import getData from "../services/get.js"

const getController = async (req, res) => {
    const response = new Response(res);

    try {

        const result = await getData();

        const matches = result.map((match) => {
            return {
                _id: match._id,
                title: match.title,
                startTime: match.startTime,
                status: match.status,
                minBet: match.minBet,
                maxBet: match.maxBet,
                createdAt: match.createdAt
            }
        });

        return response.success(matches, 'Data fetched successfully');
    } catch (err) {
        response.error({}, 'Failed to fetch data');
    }
}

export default getController;