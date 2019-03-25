var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/your_data_post', function(req, res, next){    
    var age = req.body.age;
    var l_name = req.body.l_name;
    res.render('data', { age: age, l_name: l_name});
});

router.get('/your_data_query', function(req, res, next){    
    var age = req.query.age;
    var l_name = req.query.l_name;
    res.render('data', { age: age, l_name: l_name});
});

router.get('/your_data_params/:l_name/:age', function(req, res, next){    
    var age = req.params.age;
    var l_name = req.params.l_name;
    res.render('data', { age: age, l_name: l_name});
});

module.exports = router;
