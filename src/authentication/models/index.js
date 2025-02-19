import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const dataSchema = new Schema({
    username: {
        type: String,
        required: [true, "name is required"],
        unique: true
    },
    contact: {
        type: Number,
        required: [true, "contact number is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/.+@.+\..+/, "invalid email"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "password must be at least 6 characters long"],
        maxlength: [24, "password must be at less than 24 characters long"]
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true });


dataSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

dataSchema.methods.isPasswordValid = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

const Model = mongoose.model("Users", dataSchema);

export default Model;