import Response from '../../../../class/response.js';
import MatchWithQuestionsModel from "../../add-questions/models/index.js";

const getController = async (req, res) => {
    const response = new Response(res);

    try {
        // Get current time in ISO format
        const currentTime = new Date().toISOString();

        // Find matches that haven't ended yet
        const matches = await MatchWithQuestionsModel.find({
            $or: [
                { 'matchDetails.endDate': { $gt: currentTime } },
                { 'matchDetails.endDate': { $exists: false } }
            ]
        })
            .select({
                'matchDetails.name': 1,
                'matchDetails.startDate': 1,
                'matchDetails.endDate': 1,
                'matchDetails.matchType': 1,
                'matchDetails.teams': 1,
                'questions': 1,
                createdAt: 1
            })
            .lean();

        // Format response
        const formattedMatches = matches.map(match => ({
            _id: match._id,
            title: match.matchDetails.name,
            teams: match.matchDetails.teams,
            startTime: match.matchDetails.startDate,
            matchType: match.matchDetails.matchType,
            status: match.matchDetails.endDate
                ? new Date(match.matchDetails.endDate) > new Date()
                    ? 'Upcoming'
                    : 'Live'
                : 'Schedule TBD',
            questionCount: match.questions.length,
            createdAt: match.createdAt
        }));

        return response.success(formattedMatches, 'Active matches fetched successfully');

    } catch (error) {
        // Handle mongoose errors
        if (error.name === "CastError") {
            return response.error(
                { [error.path]: "Invalid data format" },
                "Data format error",
                400
            );
        }

        // Handle other errors
        console.error('Database Error:', error);
        return response.error(
            null,
            "Failed to fetch matches",
            500
        );
    }
}

export default getController;