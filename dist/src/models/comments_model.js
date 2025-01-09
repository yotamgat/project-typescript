"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import mongoose from "mongoose";
//import {Schema,model} from 'mongoose'
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
});
const commentsModel = (0, mongoose_1.model)("comments", commentSchema);
exports.default = commentsModel;
//# sourceMappingURL=comments_model.js.map