import Response from '../../../class/response.js';
import { decodeVerifiedToken } from "../../../utils/index.js";
import PlaceBetModel from "../../bet/models/index.js"

const getByIdController = async (req, res) => {

    const response = new Response(res);
    let { _id, email, role } = decodeVerifiedToken(req.headers.authorization);


    try {

        const data = await PlaceBetModel.find({ userId: _id });

        if (!data) {
            return response.error({}, 'Data not found');
        }
        return response.success(data, "data fetched successfully");
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

export default getByIdController;