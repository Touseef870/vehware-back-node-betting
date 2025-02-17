import Response from '../../../class/response.js';
import { getById } from "../db/index.js";
import WalletModel from '../../wallet/models/index.js';
import { decodeVerifiedToken } from '../../../utils/index.js';

const postController = async (req, res) => {
    const response = new Response(res);

    let { _id, email, role } = decodeVerifiedToken(req.headers.authorization);

    if (role !== "admin") {
        return response.error(null, "You are not authorized to perform this action");
    }

    try {
        const { walletId, amount } = req.body;

        if (!walletId || !amount) {
            return response.error(null, "Wallet ID and amount are required", 400);
        }


        const wallet = await getById(walletId);
        if (!wallet) {
            return response.error(null, "Wallet not found for this user", 404);
        }

        const NumericAmount = Number(amount);
        wallet.balance += NumericAmount;

        wallet.transactions.push({
            type: 'credit',
            NumericAmount,
            date: new Date()
        });

        await wallet.save();

        const responseWallet = {
            _id: wallet._id,
            balance: wallet.balance,
            transactions: [{
                type: 'credit',
                amount: NumericAmount,
                date: new Date()
            }],
            createdAt: wallet.createdAt,
        }

        return response.success(responseWallet, 'Funds added successfully');
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

export default postController;
