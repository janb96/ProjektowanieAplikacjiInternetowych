var express = require('express');
var router = express.Router();
var reservation = require('../models/reservations.js');
var user = require('../models/users.js');
var car = require('../models/cars.js');
var sequelize = require('../connect.js');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/add-car', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }
    res.render("add-car", {alert: " "});
});

router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }
    res.render("admin-panel");
});

router.get('/manage-reservations', async function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }

    let reservations = await reservation.findAll();

    let my_reservations = [];

    for (let i = 0; i < reservations.length; i++) {
        let cars = await car.findAll({
            where:
                {
                    carID: reservations[i].carID
                }
        });

        let start = new Date(reservations[i].startDate);
        let end = new Date(reservations[i].endDate);
        let oneDay = 24 * 60 * 60 * 1000;
        let diffDays = Math.round(Math.abs((end.getTime() - start.getTime()) / (oneDay)));

        let my_reservation = {
            reservationID: reservations[i].reservationID,
            brand: cars[0].brand,
            model: cars[0].model,
            price: reservations[i].price,
            pricePerDay: cars[0].pricePerDay,
            diffDays: diffDays,
            startDate: reservations[i].startDate,
            endDate: reservations[i].endDate,
            isConfirmed: reservations[i].isConfirmed
        };

        my_reservations.push(my_reservation);

    }

    let noReservations = false;

    if (my_reservations.length == 0) {
        noReservations = true;
    }

    res.render("confirm-reservations",
        {
            noReservations: noReservations,
            reservations: my_reservations
        });

});

module.exports = router;
