import Response from '../../../class/response.js';
import postData from './../services/post.js'
import { getById } from "../db/index.js";
import { decodeVerifiedToken } from '../../../utils/index.js';

const postController = async (req, res) => {
    const response = new Response(res);

    let { _id, email, role } = decodeVerifiedToken(req.headers.authorization);

    const { amount, transactionId } = req.body;

    if (amount <= 100) {
        return response.error(null, "Amount must be a positive number");
    }

    let postObject = {
        userId: _id,
        amount,
        transactionId,
    }

    try {
        const postResponse = await postData(postObject)

        return response.success(postResponse, "successfull");

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
