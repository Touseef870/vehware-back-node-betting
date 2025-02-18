import Response from '../../../../class/response.js';
import updateData from "../services/update.js"
import { decodeVerifiedToken } from "#utils/index.js"

const updateController = async (req, res) => {
    const response = new Response(res);

    const { matchId } = req.params;

    let { role } = decodeVerifiedToken(req.headers.authorization);

    if (role !== "admin") {
        return response.error(null, "You are not authorized to perform this action");
    }

    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return response.error(null, "Request body cannot be empty");
        }

        const updateCredential = {
            title: req.body.title,
            startTime: req.body.startTime,
            status: req.body.status,
            minBet: req.body.minBet,
            maxBet: req.body.maxBet,
        }

        const result = await updateData(matchId, updateCredential);

        if (!result) {
            return response.error(null, "Match not found");
        }

        return response.success({});
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

export default updateController;