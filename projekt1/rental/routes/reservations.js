var express = require('express');
var router = express.Router();
var reservation = require('../models/reservations.js');
var user = require('../models/users.js');
var car = require('../models/cars.js');


router.get('/', async function(req, res, next) {
    // if(!req.isAuthenticated()){
    //     res.redirect('/');
    // }
    res.render("reservations", {alert: ""});
});

// reservationID: {
//     type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
// },
// userID: Sequelize.STRING,
//     carID: Sequelize.STRING,
//     startDate: Sequelize.DATE,
//     endDate: Sequelize.DATE,
//     price: Sequelize.INTEGER

router.post('/', async function(req, res, next){
    // if(!req.isAuthenticated()){
    //     res.redirect('/');
    // }
    // let userID = req.body.userID;
    // let carID = req.body.carID;

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let compare = (startDate < endDate);
    if(startDate > endDate){
        res.render("reservations", {alert: "Pick-up date is cannot be later than return date"});
    } else {
        let cars = await car.findAll();
        cars.forEach(function(car){
            
        });
        res.render("cars", {cars: cars});
    }
});

module.exports = router;
