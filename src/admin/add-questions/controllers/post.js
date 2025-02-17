import Response from '../../../../class/response.js';
import postData from "../services/post.js"
import { getDataByMatchId } from "../db/index.js"
import { decodeVerifiedToken, isValidMongooseId } from "#utils/index.js";

export default async function postController(req, res) {
    const response = new Response(res);

    const { id } = req.params;

    const isValidId = isValidMongooseId(id);
    if (!isValidId) {
        return response.error(null, "Invalid Match ID");
    }

    let { _id, email, role } = decodeVerifiedToken(req.headers.authorization);

    if (role !== "admin") {
        return response.error(null, "You are not authorized to perform this action");
    }

    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return response.error(null, "At least one question is required");
        }

        const isExistingMatch = await getDataByMatchId(id);
        if (isExistingMatch) {

            isExistingMatch.questions.push(...questions);
            await isExistingMatch.save();

            return response.success("Ok", 'Questions updated successfully');
        }


        const matchQuestions = {
            matchId: id,
            questions: questions.map(questionData => ({
                question: questionData.question,
                options: questionData.options,
            }))
        }

        const result = await postData(matchQuestions);

        const questionInfo = {
            _id: result._id,
            matchId: result.matchId,
            questions: result.questions,
            createdAt: result.createdAt
        }

        return response.success(questionInfo, 'Questions added successfully');
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
