import Response from '../../../../class/response.js';
import DepositRequestModel from "../../../transactionRequest/models/index.js"
import { decodeVerifiedToken } from "#utils/index.js";
import WalletModel from "../../../wallet/models/index.js";

const updateController = async (req, res) => {
    const response = new Response(res);


    const { role } = decodeVerifiedToken(req.headers.authorization);

    if (role !== "admin") {
        return response.error(null, "You are not authorized to perform this action");
    }

    const { depositId, status } = req.body;

    try {

        const existingDepositData = await DepositRequestModel.findById(depositId);

        if (!existingDepositData) {
            return response.error(null, "Transaction not found");
        }

        if (existingDepositData.status === "Completed") {
            return response.error(null, "Transaction already completed");
        }

        const updatedData = await DepositRequestModel.findByIdAndUpdate(
            depositId,
            { status: status },
            { new: true }
        );


        const findWallet = await WalletModel.findOne({ userId: updatedData.userId });

        if (!findWallet) {
            return response.error(null, "Wallet not found");
        }

        if (updatedData.status === "Completed") {
            findWallet.balance += updatedData.amount;

            findWallet.transactions.filter((transaction) => {
                if (transaction.historyId === updatedData.transactionId) {
                    transaction.isRecieved = true;
                    transaction.message = "Deposit Successfully";
                }
            });
            await findWallet.save();
        }

        if (updatedData.status === "Failed") {
            findWallet.transactions.filter((transaction) => {
                if (transaction.historyId === updatedData.transactionId) {
                    transaction.isRecieved = false;
                    transaction.message = "Deposit Failed";
                }
            });
            await findWallet.save();
        }

        return response.success(updatedData, "Transaction updated successfully");

    } catch (error) {
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

export default updateController;