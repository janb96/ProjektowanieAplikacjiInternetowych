var express = require('express');
var router = express.Router();

router.get('/add-car', function(req, res, next) {
    // if(!req.isAuthenticated()){
    //     res.redirect('/');
    // }
    res.render("add-car", {alert: " "});
});

router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }
    res.render("admin-panel");
});

// router.post('/', function(req, res, next){
//
// });

module.exports = router;
