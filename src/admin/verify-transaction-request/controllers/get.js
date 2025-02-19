import Response from '../../../../class/response.js';
import DepositRequestModel from "../../../transactionRequest/models/index.js"
import { decodeVerifiedToken } from "#utils/index.js";


const getController = async (req, res) => {
    const response = new Response(res);

    const { role } = decodeVerifiedToken(req.headers.authorization);

    if (role !== "admin") {
        return response.error(null, "You are not authorized to perform this action");
    }

    try {

        const data = await DepositRequestModel.find({ status: "Pending" });

        return response.success(data, 'Data fetched successfully');
    } catch (error) {

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