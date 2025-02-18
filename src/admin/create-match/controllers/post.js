import Response from '../../../../class/response.js';
import postData from "../services/post.js"
import { decodeVerifiedToken } from "#utils/index.js"

const postController = async (req, res) => {
    const response = new Response(res);

    let { role } = decodeVerifiedToken(req.headers.authorization);

    if (role !== "admin") {
        return response.error(null, "You are not authorized to perform this action");
    }

    try {

        const matchesCredential = {
            title: req.body.title,
            startTime: req.body.startTime,
            status: req.body.status,
            minBet: req.body.minBet,
            maxBet: req.body.maxBet,
        }

        const result = await postData(matchesCredential);

        const matchInfo = {
            _id: result._id,
            title: result.title,
            startTime: result.startTime,
            status: result.status,
            minBet: result.minBet,
            maxBet: result.maxBet,
            createdAt: result.createdAt
        }

        return response.success(matchInfo, 'Data fetched successfully');
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

export default postController;