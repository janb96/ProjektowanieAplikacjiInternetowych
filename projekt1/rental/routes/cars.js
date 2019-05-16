var express = require('express');
var router = express.Router();
var car = require('../models/cars.js');

router.get('/', async function(req, res, next) {
    //addCar("BMW", "730d", 200, "https://d-mf.ppstatic.pl/art/38/xw/wujwxb8kg4kw8ksks4g4s/p90333059_highres_the-new-bmw-7-series.1200.jpg", "https://d-mf.ppstatic.pl/art/38/xw/wujwxb8kg4kw8ksks4g4s/p90333059_highres_the-new-bmw-7-series.1200.jpg", "KR MM999");
    // if(!req.isAuthenticated()){
    //     res.redirect('/');
    // }
    let cars = await car.findAll();
    //console.log(cars);
    res.render("cars", { cars: cars});
});

router.post('/', function(req, res, next){
    // if(!req.isAuthenticated()){
    //     res.redirect('/');
    // }
    let brand = req.body.brand;
    let model = req.body.model;
    let pricePerDay = req.body.pricePerDay;
    let photo1 = req.body.photo1;
    let photo2 = req.body.photo2;
    let plates = req.body.plates;
    car.create({
        brand: brand,
        model: model,
        pricePerDay: pricePerDay,
        photo1: photo1,
        photo2: photo2,
        plates: plates
    }).then(result => res.render("add-car", {alert: result})).catch(function (err) {
        console.log("Cannot add to database, something go wrong: " + err);
        res.render("add-car", {alert: ""});
    });

    // if(status == undefined){
    //     res.render("add-car", {alert: "The car was added to the system"});
    // }
});


//
// router.get('/add/:facebookID/:displayName', async function(req, res, next){
//     const result = await User.findAndCountAll({where: {facebookID: req.params.facebookID}});
//     if(!result.count){
//         addUser(req.params.facebookID, req.params.displayName);
//     }
//     res.redirect('/main');
// });


module.exports = router;
