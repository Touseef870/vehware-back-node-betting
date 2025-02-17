import Response from '../../../class/response.js';
import updateData from '../services/update.js';
import { wait, decodeVerifiedToken } from '../../../utils/index.js';

const updateController = async (req, res) => {
    await wait(2000);
    const response = new Response(res);

    let { _id } = decodeVerifiedToken(req.headers.authorization)

    if (!_id) {
        return response.error("the token is invalid");
    }

    let credential = {};
    if (req.body.email) {
        credential.email = req.body.email;
    }

    if (req.body.name) {
        credential.name = req.body.name;
    }

    if (req.body.country) {
        credential.country = req.body.country;
    }

    try {

        const responseUpdatedCredential = await updateData(_id, credential);
        const data = responseUpdatedCredential.toObject();

        let credentialInfo = {
            _id: data._id,
            name: data.name,
            email: data.email,
            country: data.country,
        };

        return response.success(credentialInfo, 'Credential Updated successfully');
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

export default updateController;