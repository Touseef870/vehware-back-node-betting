import Response from '../../../class/response.js';
import Wallet from '../../wallet/models/index.js';
import { decodeVerifiedToken } from "../../../utils/index.js";
import dataGet from "../services/get.js"

const getController = async (req, res) => {
    const response = new Response(res);

    let { _id, email, role } = decodeVerifiedToken(req.headers.authorization);

    try {

        const betDetails = await dataGet(req.body.betId)

    } catch (error) {
        return response.error({});
    }

}


export default getController;