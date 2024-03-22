const mongoose = require('mongoose');
const config = require('config');

const commentSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
            maxlength: 200
        },
        parentID: {
            type: String,
            default: null
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        },

    },
    { timestamps: true }


);
const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;