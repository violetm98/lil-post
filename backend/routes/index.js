var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/checkAuth');

const postModel = require('../models/posts.model');
const userModel = require('../models/users.model');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
