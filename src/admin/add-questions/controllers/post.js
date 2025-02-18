import Response from '../../../../class/response.js';
import postData from "../services/post.js";
import { getDataByMatchId } from "../db/index.js";
import MatchModel from "../../create-match/models/index.js"
import { decodeVerifiedToken, isValidMongooseId } from "#utils/index.js";

export default async function postController(req, res) {
    const response = new Response(res);
    const { id } = req.params;

    if (!isValidMongooseId(id)) {
        return response.error(null, "Invalid Match ID");
    }

    const { role } = decodeVerifiedToken(req.headers.authorization);
    if (role !== "admin") {
        return response.error(null, "You are not authorized to perform this action");
    }

    try {
        const { questions } = req.body;
        if (!Array.isArray(questions) || questions.length === 0) {
            return response.error(null, "At least one question is required");
        }

        let matchData = await getDataByMatchId(id);

        if (matchData) {

            matchData.questions = questions.map(q => ({
                question: q.question,
                options: q.options
            }));
            await matchData.save();

            return response.success(matchData, "Questions replaced successfully");
        }

        // Create a new match entry
        const newMatch = await postData({
            matchId: id,
            questions: questions.map(q => ({
                question: q.question,
                options: q.options
            }))
        });

        return response.success({
            _id: newMatch._id,
            matchId: newMatch.matchId,
            questions: newMatch.questions,
            createdAt: newMatch.createdAt
        }, "Questions added successfully");

    } catch (error) {
        if (error.name === "ValidationError") {
            let validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return response.error(validationErrors, "Validation Error", 400);
        }

        response.error(error.message, "Internal Server Error", 500);
    }
}
