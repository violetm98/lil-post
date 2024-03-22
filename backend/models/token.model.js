const mongoose = require('mongoose');
//const config = require('config');

const tokenSchema = new mongoose.Schema(
    {

        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        token: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 1 * 60 * 60, // 1 hour for test
        }

    },



);

const tokenModel = mongoose.model('Token', tokenSchema);

module.exports = tokenModel;