var express = require('express');
const _ = require('lodash');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const checkAuth = require('../middleware/checkAuth');
var router = express.Router();

const userModel = require('../models/users.model');
const tokenModel = require('../models/token.model');
// const postModel = require('../models/posts.model');
// const likeModel = require('../models/likes.model');

/* GET users listing. */
router.get('/list', checkAuth, function (req, res, next) {
  userModel.find(

    function (err, userList) {

      if (err) {

        res.status(500).send({ error: err, message: 'unable to get the user list' });
      } else {
        const usersCount = userList.length;
        res.status(200).send({ usersCount: usersCount, list: userList });
      }
    })

});

/* GET current log in user's profile. */
router.get('/view/profile', checkAuth, function (req, res, next) {
  const userId = req.userData._id;
  // console.log(userId);
  userModel.findById(userId)

    .exec(function (err, foundUser) {

      if (err) {

        res.status(500).send({ error: err, message: 'unable to get the user' });
      } else {

        res.status(200).send({ userRes: foundUser.toJSON() });
      }
    }
    )
}

);
/* GET specific user's info. */
router.get('/view/profile/:id', checkAuth, function (req, res, next) {
  const userId = req.params.id;
  // console.log(userId);
  userModel.findById(userId)
    .select('username profileImgURL')

    .exec(function (err, foundUser) {

      if (err) {
        res.status(500).send({ error: err, message: 'unable to get the user' });
        // res.send({ status: 500, error: err, message: 'unable to get the user' });
      } else {

        res.status(200).send({ user: foundUser.toJSON() });
      }
    }
    )
}

);

/* GET specific user's posts and sort by update time (populate virtual) */
router.get('/view/posts/:id', checkAuth, function (req, res, next) {
  const userId = req.params.id;
  userModel.findById(userId).select('username profileImgURL posts')
    .populate({
      path: 'posts',
      populate: {
        path: 'postedBy', select: "username profileImgURL"
      },
      options: { sort: { updatedAt: -1 } }
    })
    .exec((err, user) => {

      if (err) {

        res.status(500).send({ error: err, message: 'unable to get the user' });
      } else {

        res.status(200).send({ user: user });
      }
    }
    )
})


/* GET a user's bookmarked posts. (populate virtual)  !!!add checkauth later!!! */
// router.get('/bookmarks/:id', function (req, res, next) {
//   userModel.findById(req.params.id)
//     .populate('bookmarkPosts')
//     .exec(function (err, user) {

//       if (err) {

//         res.send({ status: 500, error: err, message: 'unable to get the user' });
//       } else {

//         res.send({ status: 200, user: user });
//       }
//     })
// })


/* Update a user. (add checkauth later)!!!*/
router.put('/update/:id', checkAuth, function (req, res, next) {
  const { username, email, password, profileImgURL } = req.body;

  userModel.findById(req.params.id)
    .select('password')
    .exec(
      (function (err, updateUser) {
        if (err) {
          res.status(500).send({ error: err, message: 'unable to find the user' });
        } else {
          if (username) {
            updateUser.username = username;
          }
          if (email) {
            updateUser.email = email;
          }
          if (profileImgURL) {
            updateUser.profileImgURL = profileImgURL;
          }

          updateUser.save((error, user) => {
            if (error) {
              if (error.code == 11000) {
                res.status(422).send('Email address already existed');
              } else {
                res.status(500).send('Unable to update new user');
              }
            } else {
              res.status(200).send({ message: 'update the user successfully' });
            }

          });


        }
      })
    );



});

/* register a new user. */
router.post('/signup', function (req, res, next) {

  const { username, email, password } = req.body;

  let userObj = new userModel(
    {
      username: username,
      email: email,
      password: password

    }
  );

  userObj.save(function (err, userObj) {
    if (err) {

      console.log(err);
      if (err.code == 11000) {
        res.status(422).send('Email address already existed');
      } else {
        res.status(500).send('Unable to register new user');
      }

    } else {
      res.send({ status: 200, message: 'New user saved successfully', user: userObj });
    }

  });

});

/* Log in a user. */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {

    if (err) {
      return res.status(401).json(err);
    } else if (user) {
      //console.log('user is', user)
      //const refreshToken = user.genRefreshToken();
      const refreshToken = jwt.sign(
        {
          _id: user._id
        },
        config.get('development.JWT_REFRESH_SECRET'),
        {
          expiresIn: config.get('development.JWT_REFRESH_EXP_IN'),
        }

      );

      let tokenObj = new tokenModel(
        {
          userID: user._id,
          token: refreshToken,
        }
      );
      tokenObj.save();
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });// 7 days

      return res.status(200).json({ token: user.genJWTtoken(), userId: user._id, username: user.username, profileImgURL: user.profileImgURL });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);

}

)
/** Use refresh token to generate new access token */
router.get('/refresh', (req, res, next) => {
  const refresh_token = req.cookies['refreshToken'];
  //console.log('reresh token is...', refresh_token)
  tokenModel.find({ token: refresh_token }, (err, token) => {
    if (err) {
      return res.status(401).send({ message: 'unable to find the refresh token' });
    }
  });
  jwt.verify(refresh_token, config.get('development.JWT_REFRESH_SECRET'), (err, decoded) => {
    if (err) {
      return res.send({ error: err, message: 'Invalid refresh token' });
    } else {


      const access_token = jwt.sign(
        {
          _id: decoded._id
        },
        config.get('development.JWT_ACCESS_SECRET'),
        {
          expiresIn: config.get('development.JWT_EXP_IN')
        })
      return res.status(200).send({ token: access_token });
    }
  })

})
/** delete the refresh token */
router.post('/logout', function (req, res, next) {

  const refresh_token = req.cookies['refreshToken'];
  tokenModel.findOneAndDelete({ token: refresh_token }, (err, token) => {
    if (err) {

      return res.status(500).send({ error: err, message: 'unable to get the token' });

    } else {

      res.cookie('refreshToken', '', { maxAge: 0 });
      return res.status(200).send({ message: 'token deleted' });
    }

  })

})

module.exports = router;
