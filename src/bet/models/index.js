import mongoose from "mongoose";

const betSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            unique: true,
        },
        bets: [
            {
                matchId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Match",
                    required: [true, "Match ID is required"],
                },
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                    required: [true, "Question ID is required"],
                },
                selectd_Ans: {
                    type: String,
                    required: [true, "Option Answer is required"],
                    trim: true,
                    minlength: [1, "Option Answer cannot be empty"],
                },
                amount: {
                    type: Number,
                    required: [true, "Amount is required"],
                    min: [1, "Amount must be at least 1"],
                },
                is_win: {
                    type: Boolean,
                    default: null,
                },
            },
        ],
    },
    { timestamps: true }
);

const Bet = mongoose.model("Bet", betSchema);
export default Bet;
