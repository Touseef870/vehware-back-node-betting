import Response from '../../../../class/response.js';
import postData from "../services/post.js"
import { getDataByMatchId } from "../db/index.js"
import { decodeVerifiedToken, isValidMongooseId } from "#utils/index.js";

const getController = async (req, res) => {
    const response = new Response(res);

    const { id } = req.params;

    const isValidId = isValidMongooseId(id);
    if (!isValidId) {
        return response.error(null, "Invalid Match ID");
    }

    try {

        const isQuestionsExist = await getDataByMatchId(id);
       
        if (!isQuestionsExist) {
            return response.error(null, "Questions not found");
        }

        const questions = {
            _id: isQuestionsExist._id,
            matchId: isQuestionsExist.matchId,
            questions: isQuestionsExist.questions
        }

        return response.success(questions, 'Data fetched successfully');
    } catch (err) {
        response.error({}, 'Failed to fetch data');
    }
}

export default getController;