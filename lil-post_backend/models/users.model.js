const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const jwt = require('jsonwebtoken');
const config = require('config');



//use refresh token to help revoke session on devices
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        maxlength: 60
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [5, 'Password must be at least 5 characters long'],
        select: false

    },
    profileImgURL: {
        type: String,
        default: config.get('development.default_profile_img')
    },



}, { timestamps: true }
)

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'postedBy'
})
userSchema.virtual('likePosts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'likes'
})
userSchema.virtual('bookmarkPosts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'bookmarks'
})

userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })


/* Instance methods */
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();//clone

    // return _.omit(userObject, ['password']);
    return userObject;
}


userSchema.methods.genJWTtoken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        config.get('development.JWT_ACCESS_SECRET'),
        {
            expiresIn: config.get('development.JWT_EXP_IN')
        }

    );
}

userSchema.methods.genRefreshToken = () => {
    return jwt.sign(
        {
            _id: this.id
        },
        config.get('development.JWT_REFRESH_SECRET'),
        { expiresIn: '1d' })
}

userSchema.methods.verifyPassword = function (password) {

    return bcrypt.compareSync(password, this.password);
}


//validation for email
userSchema.path('email').validate((value) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
}, 'Invalid email address');


// middleware, before saving a user 
userSchema.pre('save', function (next) {

    if (this.password && this.isModified('password')) {
        let saltRounds = 10;

        //generate salt and hash password
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                this.password = hash;

                next();
            })
        })
    } else {
        next();
    }

}


)



const userModel = mongoose.model('User', userSchema);

module.exports = userModel;