var express = require('express');
var router = express.Router();
var car = require('../models/cars.js');

router.get('/', async function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }
    let cars = await car.findAll();
    res.render("cars", { cars: cars});
});

router.post('/', function(req, res, next){
    if(!req.isAuthenticated()){
        res.redirect('/');
    }
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

});

module.exports = router;
