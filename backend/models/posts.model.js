const mongoose = require('mongoose');
const config = require('config');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 140
        },
        content: {
            type: String,
            required: true,

        },
        imgURL: [{
            type: String,
            default: config.get('development.default_profile_img')
        }],





        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

    },
    { timestamps: true }


);

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;