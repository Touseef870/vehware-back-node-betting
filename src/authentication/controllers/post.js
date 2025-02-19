import Response from '../../../class/response.js';
import postData from '../services/post.js';
import generateToken from '../../../utils/generateToken.js';
import WalletModel from '../../wallet/models/index.js';

const postController = async (req, res) => {
    const response = new Response(res);

    if (req.body.role) {
        return response.error("role is not allowed");
    }

    try {

        let userInfo = {};
        userInfo.username = req.body.username;
        userInfo.email = req.body.email;
        userInfo.contact = req.body.contact;
        userInfo.password = req.body.password;
        userInfo.role = "user"

        const credential = await postData(userInfo);
        const token = generateToken(credential);

        const newWallet = new WalletModel({
            userId: credential._id,
            balance: 0,
            transactions: []
        });
        await newWallet.save();

        if (credential) {
            userInfo.id = credential._id;
            userInfo.token = token;
            delete userInfo.role
            delete userInfo.password
        }
        // let credentialInfo = {
        //     _id: credential._id,
        //     username: credential.username,
        //     email: credential.email,
        //     contact: credential.phone,
        //     role: credential.role,
        //     token: token,
        // };

        return response.success(userInfo, 'Data Added successfully');
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

export default postController;