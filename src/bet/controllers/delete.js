import Response from '../../../class/response.js';
import deleteData from '../services/delete.js';
import { wait, decodeVerifiedToken } from '../../../utils/index.js';

const deleteController = async (req, res) => {
    await wait(2000);
    const response = new Response(res);

    let { _id } = decodeVerifiedToken(req.headers.authorization)

    if (!_id) {
        return response.error("the token is invalid");
    }

    try {
        const deletedCredential = await deleteData(_id);

        if (!deletedCredential) {
            return response.error("Data not found by provided id");
        }

        return response.success({ id: _id }, 'Data Deleted successfully');
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

export default deleteController;