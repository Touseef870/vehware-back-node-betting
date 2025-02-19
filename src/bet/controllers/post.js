import Response from '../../../class/response.js';
import Wallet from '../../wallet/models/index.js';
import BetModel from '../models/index.js';
import { decodeVerifiedToken } from "../../../utils/index.js";
import postData from '../services/post.js';

const placeBetController = async (req, res) => {
    const response = new Response(res);
    let { _id, email, role } = decodeVerifiedToken(req.headers.authorization);


    const session = await Wallet.startSession();
    session.startTransaction();

    try {
        const { matchId, questionId, selectd_Ans, amount } = req.body;

        const betCredential = {
            userId: _id,
            bets: [
                {
                    matchId,
                    questionId,
                    selectd_Ans,
                    amount
                }
            ]
        }


        const userWallet = await Wallet.findOne({ userId: _id }).session(session);
        if (!userWallet) {
            await session.abortTransaction();
            session.endSession();
            return response.error([], "Wallet not found for this user");
        }

        if (userWallet.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return response.error(null, "Insufficient balance");
        }

        userWallet.balance -= amount;
        await userWallet.save({ session });

        let userBet = await BetModel.findOne({ userId: _id }).session(session);

        if (!userBet) {
            let mewUserBet = await postData(betCredential);
            betCredential._id = mewUserBet._id

            await session.commitTransaction();
            session.endSession();

            return response.success(betCredential, "Bet placed successfully");
        } else {
            userBet.bets.push({ questionId, matchId, selectd_Ans, amount });
        }

        await userBet.save({ session });
        betCredential._id = userBet._id

        await session.commitTransaction();
        session.endSession();

        return response.success(betCredential, "Bet placed successfully");

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error.code == 11000) {
            let duplicationErrors = {}
            for (let field in error.keyPattern) {
                duplicationErrors[field] = `${field} already exists`
            }
            return response.error(duplicationErrors, "Duplicate Key Error", 400)
        }

        if (error.name === "ValidationError") {
            let validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return response.error(validationErrors, "Validation Error");
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
};

export default placeBetController;