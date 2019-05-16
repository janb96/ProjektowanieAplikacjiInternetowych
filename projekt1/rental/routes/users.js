var express = require('express');
var router = express.Router();
var user = require('../models/users.js');

function addUser(facebookID, name){
  user.create({
    facebookID: facebookID,
    name: name
  }).then(result => console.log("User add to database, his userID is: " + result.userID));
}

router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()){
    res.redirect('/');
  }
  res.send("Users");
});

router.get('/add/:facebookID/:displayName', async function(req, res, next){
  const result = await user.findAndCountAll({where: {facebookID: req.params.facebookID}});
  if(!result.count){
    addUser(req.params.facebookID, req.params.displayName);
  }
  res.redirect('/main');
});


module.exports = router;
