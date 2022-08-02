var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/checkAuth');

// const postModel = require('../models/posts.model');
// const userModel = require('../models/users.model');
const commentModel = require('../models/comments.model');

/* GET comments. (given the post id) */
router.get('/:id', checkAuth, function (req, res, next) {
  commentModel.find({ post: req.params.id })
    .populate("author", "_id username profileImgURL")
    .sort({ createdAt: 'desc' })
    .exec((err, commentList) => {
      if (err) {
        res.send({ status: 500, error: err, message: 'unable to get the comments' });
      } else {
        const commentsCount = commentList.length;
        res.send({ status: 200, commentsCount: commentsCount, list: commentList });
        //res.json(commentList)
      }
    })
});
//GET reply count
router.get('/reply/:id', checkAuth, function (req, res, next) {
  commentModel.find({ parentID: req.params.id })

    .exec((err, comments) => {
      if (err) {
        res.status(500).send({ error: err, message: 'unable to get the comments' });
      } else {
        const commentsCount = comments.length;
        res.status(200).send({ count: commentsCount });
        //res.json(commentList)
      }
    })
});

/* POST new comment (given the post id) */
router.post('/add/:id', checkAuth, function (req, res, next) {

  const { body, parentID, post } = req.body;
  if (!req.userData) {
    res.send({ status: 500, message: 'no token' });
  }
  else {
    const author = req.userData._id;
    let commentObj = new commentModel(
      {
        body: body,
        parentID: parentID,
        post: post,
        author: author
      }
    );
    commentObj.save(function (err, comment) {
      if (err) {

        res.send({ status: 500, error: err, message: 'unable to create new comment' });
      } else {
        //comment.populate('author')
        //console.log(comment)
        res.send({ status: 200, message: 'new comment saved successfully', commentDetail: comment });
      }
    }
    )
    commentObj.populate('author', 'username profileImgURL');


  }
})

/* DELETE a comment. (given the comment id) */
router.delete('/delete/:id', checkAuth, function (req, res, next) {
  const commentID = req.params.id;

  commentModel.findByIdAndDelete(commentID, async function (err, comment) {
    if (err) {

      res.status(500).send({ error: err, message: 'unable to delete the comment' });
    } else {

      //if user delete a parent comment, we need to delete its child comment same time
      if (comment.parentID === null) {
        // console.log('deleting child of', commentID)
        commentModel.deleteMany({ parentID: commentID }, function (err, result) {
          if (err) {
            res.send({ 'error': err });
          }
          else {
            res.send({ status: 200, message: 'comments deleted successfully' });
          }
        });

      } else {
        res.send({ status: 200, message: 'comment deleted successfully' });
      }
      // 

    }
  });


});


module.exports = router;
