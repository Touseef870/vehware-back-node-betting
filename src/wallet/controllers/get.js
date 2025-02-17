import Response from '../../../class/response.js';
import dataGet from '../services/get.js';
import { decodeVerifiedToken } from '../../../utils/index.js';

const getController = async (req, res) => {
    const response = new Response(res);

    let { _id, email, role } = decodeVerifiedToken(req.headers.authorization);


    try {

        const walletDetails = await dataGet(_id);
        if (!walletDetails) {
            return response.error([], "Wallet not found for this user");
        }

        const wallet = walletDetails.toObject();

        const responseWallet = {
            _id: wallet._id,
            balance: wallet.balance,
            transactions: wallet.transactions,
            createdAt: wallet.createdAt,
        }

        return response.success(responseWallet, 'Wallet details fetched successfully');
    } catch (error) {

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

export default getController;