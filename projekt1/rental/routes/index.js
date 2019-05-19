var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()){
    res.redirect('/');
  }
  res.render('index', { user: req.user });
});

module.exports = router;
