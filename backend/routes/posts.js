var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/checkAuth');

var mongoose = require('mongoose');
const postModel = require('../models/posts.model');
const userModel = require('../models/users.model');

/* GET posts listing(from all users). */
router.get('/list', checkAuth, function (req, res, next) {

  postModel.find()
    .populate("postedBy", "_id username profileImgURL")
    .sort({ createdAt: 'desc' })
    .exec(function (err, postList) {

      if (err) {
        // console.log(err);
        res.send({ status: 500, message: 'unable to get the list' });
      } else {
        const postsCount = postList.length;
        res.send({ status: 200, postsCount: postsCount, list: postList });
      }
    })


});

/* GET details of a specific post. (given the post id) */
router.get('/view/:id', checkAuth, function (req, res, next) {

  postModel.findById(req.params.id)
    .populate("postedBy", "_id username profileImgURL")
    .exec(function (err, postRes) {
      if (err) {
        console.log(err);
        res.send({ status: 500, message: 'unable to get the post' });
      } else {

        res.status(200).send({ result: postRes });
      }
    })


});

/* Create a new post. */
router.post('/add', checkAuth, function (req, res, next) {
  const { title, content, imgURL, } = req.body;
  if (!req.userData) {
    res.send({ status: 500, message: 'no token' });
  }
  else {
    const postedBy = req.userData._id;
    let postObj = new postModel(
      {
        title: title,
        content: content,
        imgURL: imgURL,
        postedBy: postedBy
      }
    );

    postObj.save(function (err, postObj) {
      if (err) {
        console.log(err);
        res.send({ status: 500, message: 'unable to create new post', error: err });
      } else {
        res.send({ status: 200, message: 'new post saved successfully', postDetail: postObj });
      }

    });
  }
});

/* Update a post. (add checkauth later)!!! */
router.put('/update/:id', checkAuth, function (req, res, next) {

  const { title, content, imgURL, likes, bookmarkedCount, comments } = req.body;

  let updatedPostObj =
  {
    title: title,
    content: content,
    imgURL: imgURL,

    likes: likes,
    bookmarkedCount: bookmarkedCount,
    comments: comments
  }

  postModel.findByIdAndUpdate(req.params.id, updatedPostObj, { new: true }, function (err, postRes) {
    if (err) {
      // console.log(err);
      res.send({ status: 500, message: 'unable to update the post' });
    } else {
      res.send({ status: 200, result: postRes });
    }
  });

});

/* DELETE a post. */
router.delete('/delete/:id', checkAuth, function (req, res, next) {

  postModel.findByIdAndDelete(req.params.id, function (err, postRes) {
    if (err) {
      // console.log(err);
      res.send({ status: 500, message: 'unable to delete the post' });
    } else {

      res.send({ status: 200, message: 'post deleted successfully', result: postRes });
    }
  });

});

module.exports = router;