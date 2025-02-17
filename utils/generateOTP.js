import { Types } from 'mongoose';

const generateOTP = (mongooseId) => {
    if (!mongooseId || !(mongooseId instanceof Types.ObjectId)) {
        throw new Error('Invalid Mongoose ObjectId');
    }

    const idString = mongooseId.toString();

    const last3Digits = idString.slice(-3);

    return last3Digits
};

export default generateOTP;
