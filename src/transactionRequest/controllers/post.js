import Response from '../../../class/response.js';
import postData from './../services/post.js'
import { decodeVerifiedToken } from '../../../utils/index.js';
import walletSchema from "../../wallet/models/index.js";

const postController = async (req, res) => {
    const response = new Response(res);

    let { _id, email, role } = decodeVerifiedToken(req.headers.authorization);

    const { amount, transactionId } = req.body;

    if (amount <= 100) {
        return response.error(null, "Amount must be greater than 100");
    }

    let postObject = {
        userId: _id,
        amount,
        transactionId,
    }

    try {
        const postResponse = await postData(postObject)

        if (postResponse) {
            let wallet = await walletSchema.findOne({ userId: _id });

            if (!wallet) {
                return response.error(null, "Wallet not found");
            }

            wallet.transactions.push({
                amount,
                type: "credit",
                currentBalance: wallet.balance,
                message: "Deposit",
                historyId: transactionId
            });

            await wallet.save();
        }

        return response.success(postResponse, "successfull");

    } catch (error) {

        if (error.code == 11000) {
            let duplicationErrors = {}
            for (let field in error.keyPattern) {
                duplicationErrors[field] = `${field} already exists`
            }
            return response.error(duplicationErrors, "Duplicate Key Error", 400)
        }

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