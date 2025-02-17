import mongoose from "mongoose";

const isValidMongooseId = (id) => mongoose.Types.ObjectId.isValid(id);

export default isValidMongooseId;
