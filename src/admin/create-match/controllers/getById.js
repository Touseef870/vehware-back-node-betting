import Response from '../../../../class/response.js';
import { getDataByMatchId } from "../../add-questions/db/index.js"
import { getById } from "../db/index.js"

const getByIdController = async (req, res) => {
    const response = new Response(res);

    try {
        const { id } = req.params;

        const match = await getById(id);
        if (!match) {
            return response.error({}, 'Match not found');
        }

        const matchesQuestion = await getDataByMatchId(id);
        if (!matchesQuestion) {
            return response.error({}, 'Match Question not found');
        }

        const matchInfo = {
            _id: match._id,
            title: match.title,
            startTime: match.startTime,
            status: match.status,
            minBet: match.minBet,
            maxBet: match.maxBet,
            createdAt: match.createdAt,
            questions: matchesQuestion.questions.map((question) => {
                return {
                    _id: question._id,
                    question: question.question,
                    options: question.options,
                }
            })
        }

        return response.success(matchInfo, 'Match found successfully');
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

export default getByIdController;