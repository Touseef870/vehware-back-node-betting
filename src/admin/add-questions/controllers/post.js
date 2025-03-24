// import Response from '../../../../class/response.js';
// import postData from "../services/post.js";
// import { getDataByMatchId } from "../db/index.js";
// import MatchModel from "../../create-match/models/index.js"
// import { decodeVerifiedToken, isValidMongooseId } from "#utils/index.js";

// export default async function postController(req, res) {
//     const response = new Response(res);
//     const { id } = req.params;

//     if (!isValidMongooseId(id)) {
//         return response.error(null, "Invalid Match ID");
//     }

//     const { role } = decodeVerifiedToken(req.headers.authorization);
//     if (role !== "admin") {
//         return response.error(null, "You are not authorized to perform this action");
//     }

//     try {
//         const { questions } = req.body;
//         if (!Array.isArray(questions) || questions.length === 0) {
//             return response.error(null, "At least one question is required");
//         }

//         let matchData = await getDataByMatchId(id);

//         if (matchData) {

//             matchData.questions = questions.map(q => ({
//                 question: q.question,
//                 options: q.options
//             }));
//             await matchData.save();

//             return response.success(matchData, "Questions replaced successfully");
//         }

//         // Create a new match entry
//         const newMatch = await postData({
//             matchId: id,
//             questions: questions.map(q => ({
//                 question: q.question,
//                 options: q.options
//             }))
//         });

//         return response.success({
//             _id: newMatch._id,
//             matchId: newMatch.matchId,
//             questions: newMatch.questions,
//             createdAt: newMatch.createdAt
//         }, "Questions added successfully");

//     } catch (error) {

//         if (error.code == 11000) {
//             let duplicationErrors = {}
//             for (let field in error.keyPattern) {
//                 duplicationErrors[field] = `${field} already exists`
//             }
//             return response.error(duplicationErrors, "Duplicate Key Error", 400)
//         }

//         if (error.name === "ValidationError") {
//             let validationErrors = {};
//             for (let field in error.errors) {
//                 validationErrors[field] = error.errors[field].message;
//             }
//             return response.error(validationErrors, "Validation Error", 400);
//         }

//         let messages = [];
//         if (error.errors) {
//             for (let field in error.errors) {
//                 messages.push(error.errors[field].message);
//             }
//         } else {
//             messages.push(error.message);
//         }

//         response.error(messages, "Internal Server Error", 500);
//     }
// }



import Response from '../../../../class/response.js';
import postData from "../services/post.js";
import { getDataByMatchId } from "../db/index.js";
import MatchModel from "../../create-match/models/index.js"
import { decodeVerifiedToken, isValidMongooseId } from "#utils/index.js";
import axios from 'axios';

export default async function postController(req, res) {
    const response = new Response(res);
    const { id: matchId } = req.params;

    const { role } = decodeVerifiedToken(req.headers.authorization);
    if (role !== "admin") {
        return response.error(null, "Admin Authorization Required", 403);
    }

    // 2. Fetch Live Match Details
    let liveMatchData;
    try {
        const apiResponse = await axios.get(`https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
            },
            timeout: 5000 // 5 seconds timeout
        });

        if (!apiResponse.data?.matchDetails) {
            throw new Error('Invalid live match data structure');
        }

        liveMatchData = {
            name: apiResponse.data.matchDetails.matchInfo?.name,
            series: apiResponse.data.matchDetails.matchInfo?.series?.name,
            venue: `${apiResponse.data.matchDetails.venueInfo?.ground}, ${apiResponse.data.matchDetails.venueInfo?.city}`,
            teams: [
                apiResponse.data.matchDetails.team1?.shortName,
                apiResponse.data.matchDetails.team2?.shortName
            ],
            startDate: apiResponse.data.matchDetails.matchInfo?.startDate,
            endDate: apiResponse.data.matchDetails.matchInfo?.endDate || null,
            matchType: apiResponse.data.matchDetails.matchInfo?.matchType
        };

        if (!liveMatchData.endDate) {
            const matchStart = new Date(liveMatchData.startDate);
            liveMatchData.endDate = new Date(matchStart.getTime() + 3.5 * 60 * 60 * 1000);
        }
    } catch (apiError) {
        return response.error(
            { apiError: apiError.message },
            "Failed to fetch live match details",
            502
        );
    }

    // 3. Request Body Validation
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
        return response.error(
            { field: 'questions' },
            "Minimum 1 question required",
            400
        );
    }

    // 4. Validate Question Structure
    const invalidQuestions = questions.filter(q =>
        !q.question?.trim() ||
        !Array.isArray(q.options) ||
        q.options.length < 2
    );

    if (invalidQuestions.length > 0) {
        return response.error(
            { invalidQuestions },
            "Invalid question structure",
            400
        );
    }

    // 5. Database Operation
    try {
        const existingMatch = await getDataByMatchId(matchId);
        const matchPayload = {
            ...liveMatchData,
            questions: questions.map(q => ({
                question: q.question.trim(),
                options: q.options.map(opt => opt.trim()),
                correctAnswer: q.correctAnswer?.trim()
            }))
        };

        // Update existing match
        if (existingMatch) {
            if (existingMatch.series !== matchPayload.series) {
                return response.error(
                    { conflict: 'series-mismatch' },
                    "Cannot update series information",
                    409
                );
            }

            const updatedMatch = await MatchModel.findByIdAndUpdate(
                existingMatch._id,
                { $set: matchPayload },
                { new: true, runValidators: true }
            );

            return response.success({
                _id: updatedMatch._id,
                matchId: updatedMatch.matchId,
                name: updatedMatch.name,
                questions: updatedMatch.questions
            }, "Match details updated successfully");
        }

        // Create new match
        const newMatch = await postData({
            matchId,
            ...matchPayload
        });

        return response.success({
            _id: newMatch._id,
            matchId: newMatch.matchId,
            name: newMatch.name,
            questions: newMatch.questions
        }, "New match created with questions");

    } catch (error) {
        // Handle database errors
        if (error.code === 11000) {
            const conflictField = Object.keys(error.keyPattern)[0];
            return response.error(
                { [conflictField]: `${conflictField} already exists` },
                "Duplicate entry detected",
                409
            );
        }

        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).reduce((acc, err) => {
                acc[err.path] = err.message;
                return acc;
            }, {});
            return response.error(validationErrors, "Data validation failed", 400);
        }

        // Unknown errors
        console.error('Database Error:', error);
        return response.error(
            null,
            "Internal server error",
            500
        );
    }
}