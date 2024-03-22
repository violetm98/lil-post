const mongoose = require('mongoose');
const config = require('config');

const likeSchema = new mongoose.Schema(
    {

        postID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },

        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        },

    },
    { timestamps: true }


);

const likeModel = mongoose.model('Like', likeSchema);

module.exports = likeModel;