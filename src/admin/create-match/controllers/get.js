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
    } catch (error) {

        if (error.name === "ValidationError") {
            let validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return response.error(validationErrors, "Validation Error", 400);
        }

        let messages = [];
        if (error.errors) {
            for (let field in error.errors) {
                messages.push(error.errors[field].message);
            }
        } else {
            messages.push(error.message);
        }

        response.error(messages, "Internal Server Error", 500);
    }
}

export default getController;