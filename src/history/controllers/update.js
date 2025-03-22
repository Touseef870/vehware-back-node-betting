import Response from '../../../class/response.js';

const updateController = async (req, res) => {
    const response = new Response(res); 

    try {
        return response.success({});
    } catch (err) {
        response.error({});
    }
}

export default updateController;