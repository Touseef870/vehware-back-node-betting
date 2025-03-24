import mongoose from "mongoose";

const matchWithQuestionsSchema = new mongoose.Schema(
    {
        // Live API से आने वाला मूल match ID (String format में)
        matchId: {
            type: String,
            required: [true, "Match ID is required"],
            unique: true,
            index: true,
            ref: "Matches"
        },

        // मैच की बेसिक जानकारी
        matchDetails: {
            name: {
                type: String,
                required: [true, "Match name is required"],
                maxlength: [100, "Match name too long"]
            },
            teams: {
                type: [String], // ["India", "Australia"]
                required: [true, "Teams are required"],
                validate: {
                    validator: v => Array.isArray(v) && v.length === 2,
                    message: "Exactly 2 teams required"
                }
            },
            venue: {
                type: String,
                required: [true, "Venue is required"],
                default: "TBC" // To Be Confirmed
            },
            series: {
                type: String,
                required: [true, "Series name is required"]
            },
            startDate: {
                type: Date,
                required: [true, "Start date is required"]
            },
            endDate: {
                type: String,
                required: [true, "End date is required"]
            },
            matchType: {
                type: String,
                enum: ["T20", "ODI", "Test", "League"],
                required: [true, "Match type is required"]
            }
        },

        // प्रश्नों की सूची
        questions: [
            {
                question: {
                    type: String,
                    required: [true, "Question is required"],
                    minlength: [10, "Question too short (min 10 chars)"],
                    maxlength: [250, "Question too long (max 250 chars)"],
                    trim: true
                },
                options: {
                    type: [String],
                    required: [true, "Options are required"],
                    validate: {
                        validator: function (v) {
                            return v.length >= 2 && v.length <= 4;
                        },
                        message: "2-4 options required"
                    }
                },
                correctOption: {
                    type: String,
                    validate: {
                        validator: function (v) {
                            return this.options.includes(v);
                        },
                        message: "Correct answer must be in options"
                    }
                },
                odds: { // Optional betting odds
                    type: Map,
                    of: Number
                }
            }
        ]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for faster queries
matchWithQuestionsSchema.index({ "matchDetails.startDate": 1 });
matchWithQuestionsSchema.index({ "matchDetails.teams": 1 });

const MatchWithQuestions = mongoose.model(
    "MatchWithQuestions",
    matchWithQuestionsSchema
);

export default MatchWithQuestions;