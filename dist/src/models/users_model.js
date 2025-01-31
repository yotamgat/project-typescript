"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import mongoose from "mongoose";
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    refreshTokens: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        default: 'http://localhost:3000/uploads/avatar3.png'
    },
    username: {
        type: String,
        required: true,
    }
});
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
//# sourceMappingURL=users_model.js.map