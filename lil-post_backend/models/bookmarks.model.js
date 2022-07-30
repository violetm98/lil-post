const mongoose = require('mongoose');
const config = require('config');

const bookmarkSchema = new mongoose.Schema(
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

const bookmarkModel = mongoose.model('bookmark', bookmarkSchema);

module.exports = bookmarkModel;