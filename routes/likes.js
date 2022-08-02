var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const postModel = require('../models/posts.model');
const userModel = require('../models/users.model');
const likeModel = require('../models/likes.model');

/* GET user liked post and sort them by the time user likes.(given user's id) */
router.get('/:id', checkAuth, function (req, res, next) {
    likeModel.find({ userID: req.params.id })
        .populate({
            path: 'postID',
            populate: {
                path: 'postedBy', select: "username profileImgURL"
            },
        })
        .sort({ createdAt: 'desc' })
        .exec(function (err, likes) {

            if (err) {

                res.send({ status: 500, error: err, message: 'unable to get the user' });
            } else {

                res.send({ status: 200, likes: likes });
            }
        })
});

/* GET likes count.(given post's id) */
router.get('/count/:id', checkAuth, function (req, res, next) {
    likeModel.find({ postID: req.params.id })

        .exec(function (err, likes) {

            if (err) {

                res.send({ status: 500, error: err, message: 'unable to get the user' });
            } else {
                let likesCount = likes.length
                res.send({ status: 200, likesCount: likesCount });
            }
        })
});

/* GET likes combination.(given post's id) */
router.get('/status/:id', checkAuth, function (req, res, next) {
    const userID = req.userData._id;
    //console.log(userID);
    likeModel.find({ postID: req.params.id, userID: userID })

        .exec(function (err, likes) {

            if (err) {

                res.send({ status: 500, error: err, message: 'unable to get the like status' });
            } else {
                let likesCount = likes.length //0 or 1
                res.send({ status: 200, likesCount: likesCount });
            }
        })
});

/* DELETE a like.(given post's id) */
router.delete('/delete/:id', checkAuth, function (req, res, next) {
    const userID = req.userData._id;


    likeModel.findOneAndDelete({ postID: req.params.id, userID: userID }, function (err, deleteLike) {
        if (err) {

            res.send({ status: 500, error: err, message: 'cannot delete the like' });

        } else {
            res.send({ status: 200, message: 'delete like successfully', deleteLike: deleteLike });
        }

    });

})

/* POST a new like (given post's id) */
router.post('/add/:id', checkAuth, function (req, res, next) {
    const { userID } = req.body;

    //const postedBy = req.userData._id;
    let likeObj = new likeModel(
        {
            postID: req.params.id,
            userID: userID
        }
    );

    likeObj.save(function (err, likeObj) {
        if (err) {

            res.send({ status: 500, error: err, message: 'unable to save new like' });
        } else {
            res.send({ status: 200, message: 'new like saved successfully', like: likeObj });
        }

    });

});


module.exports = router;
