import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const dataSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email"]
    },
    username: {
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [25, "Password must be at most 25 characters long"]
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