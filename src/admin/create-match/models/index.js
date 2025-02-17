import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required'],
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Start time must be in the future'
        }
    },
    status: {
        type: String,
        enum: {
            values: ["upcoming", "live", "completed"],
            message: 'Status must be either upcoming, live, or completed'
        },
        default: "upcoming"
    },
    minBet: {
        type: Number,
        required: [true, 'Minimum bet is required'],
        min: [1, 'Minimum bet must be at least 1']
    },
    maxBet: {
        type: Number,
        required: [true, 'Maximum bet is required'],
        validate: {
            validator: function (value) {
                return value > this.minBet;
            },
            message: 'Maximum bet must be greater than minimum bet'
        }
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length > 0;
            },
            message: 'At least one question is required'
        }
    }]
}, { timestamps: true });

const MatchModel = mongoose.model("Matches", matchSchema);
export default MatchModel;