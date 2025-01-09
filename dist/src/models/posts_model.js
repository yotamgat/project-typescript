"use strict";
//import mongoose from "mongoose";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
    },
});
const postModel = (0, mongoose_1.model)("Posts", postSchema);
exports.default = postModel;
//# sourceMappingURL=posts_model.js.map