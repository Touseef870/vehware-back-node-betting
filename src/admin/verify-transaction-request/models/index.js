import mongoose from "mongoose";

const matchWithQuestionsSchema = new mongoose.Schema(
    {
        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Match ID is required"],
            ref: "Matches",
        },
        questions: [
            {
                question: {
                    type: String,
                    required: [true, "Question is required"],
                    minlength: [5, "Question must be at least 5 characters long"],
                    maxlength: [200, "Question cannot exceed 200 characters"],
                    trim: true, // Removes unnecessary spaces
                },
                options: {
                    type: [String], // Array of strings for options
                    required: [true, "Options are required"],
                    validate: {
                        validator: function (value) {
                            return Array.isArray(value) && value.length >= 2;
                        },
                        message: "At least two options are required",
                    },
                },
            },
        ],
    },
    { timestamps: true }
);

// **Model Export**
const MatchWithQuestionsModel = mongoose.model(
    "MatchWithQuestion",
    matchWithQuestionsSchema
);

export default MatchWithQuestionsModel;
