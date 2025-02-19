import Response from '../../../class/response.js';
import { getById } from "../db/index.js";
import { decodeVerifiedToken } from "../../../utils/index.js";

const getByIdController = async (req, res) => {

    const response = new Response(res);
    let { _id, email, role } = decodeVerifiedToken(req.headers.authorization);

    try {

        const credentialResponse = await getById(_id);
        if (!credentialResponse) {
            return response.error(null, "id doesn't match any data");
        }

        const credential = credentialResponse.toObject();

        const credentialInfo = {
            _id: credential._id,
            userId: credential.userId,
            bets: credential.bets.map(bet => ({
                _id: bet._id,
                questionId: bet.questionId,
                optionAns: bet.selectd_Ans,
                amount: bet.amount,
                win: bet.is_win
            }))
        };

        return response.success(credentialInfo, "data fetched successfully");
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