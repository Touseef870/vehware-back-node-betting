import Response from '../../../class/response.js';
import PlaceBetModel from "../../bet/models/index.js"

const getController = async (req, res) => {
    const response = new Response(res);

    try {

        const data = await PlaceBetModel.find();

        if (!data) {
            return response.error({}, 'Data not found');
        }

        return response.success(data, 'Data fetched successfully');
    } catch (err) {
        response.error({}, 'Failed to fetch data');
    }
}

export default getController;