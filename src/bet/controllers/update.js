import Response from '../../../class/response.js';
import { getById } from "../db/index.js";
import { wait, decodeVerifiedToken } from '../../../utils/index.js';

const updateController = async (req, res) => {

    const response = new Response(res);

    const { userId, betId } = req.params;

    let { role } = decodeVerifiedToken(req.headers.authorization);

    if (role !== "admin") {
        return response.error(null, "You are not authorized to perform this action");
    }

    try {

        const isUserExist = await getById(userId);
        if (!isUserExist) {
            return response.error(null, "id doesn't match any data");
        }

        const isQuestionMatch = isUserExist.bets.find(bet => bet._id == betId);
        if (!isQuestionMatch) {
            return response.error(null, "Bet not found");
        }

        isQuestionMatch.is_win = req.body.win;

        await isUserExist.save();

        return response.success(isQuestionMatch, 'Credential Updated successfully');
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

export default updateController;