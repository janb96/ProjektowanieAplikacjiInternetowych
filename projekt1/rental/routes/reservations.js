var express = require('express');
var router = express.Router();
var reservation = require('../models/reservations.js');
var user = require('../models/users.js');
var car = require('../models/cars.js');
var sequelize = require('../connect.js');
var Sequelize = require('sequelize');
const Op = Sequelize.Op


router.get('/', async function(req, res, next) {
    // if(!req.isAuthenticated()){
    //     res.redirect('/');
    // }
    res.render("reservations", {alert: ""});
});

router.get('/add', async function(req, res, next) {
    reservation.create({
        userID: 1,
        carID: 1,
        startDate: "2019-05-17 ",
        endDate: "2019-05-20",
        price: 1000
    });
    res.render("reservations", {alert: ""});
});

router.post('/', async function(req, res, next){

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    if(startDate >= endDate){
        res.render("reservations", {alert: "Pick-up date is cannot be later than return date"});
    } else {
        let cars = await car.findAll();
        let idSet = new Set();

        for(let i=0; i < cars.length; i++){
            console.log("0 .... 0 .... ==== " + cars[i].carID);
            // Case which look like: * | * |
            let reservations1case = await reservation.findAndCountAll({where: {
                    [Op.and]: [
                        {
                            startDate: {
                                [Op.gt]: startDate,
                                [Op.lte]: endDate
                            }
                        },
                        {
                            endDate: {
                                [Op.gt]: endDate
                            }
                        },
                        {
                            carID: cars[i].carID
                        }
                    ]
                }});

            // Case which look like: * |  | *
            let reservations2case = await reservation.findAndCountAll({where: {
                    [Op.and]: [
                        {
                            startDate: {
                                [Op.gt]: startDate
                            }
                        },
                        {
                            endDate: {
                                [Op.lt]: endDate
                            }
                        },
                        {
                            carID: cars[i].carID
                        }
                    ]
                }});

            // Case which look like:  | * | *
            let reservations3case = await reservation.findAndCountAll({where: {
                    [Op.and]: [
                        {
                            startDate: {
                                [Op.lt]: startDate
                            }
                        },
                        {
                            endDate: {
                                [Op.lt]: endDate,
                                [Op.gt]: startDate,
                            }
                        },
                        {
                            carID: cars[i].carID
                        }
                    ]
                }});

            // Case which look like:  | * * |
            let reservations4case = await reservation.findAndCountAll({where: {
                    [Op.and]: [
                        {
                            startDate: {
                                [Op.lt]: startDate,
                                [Op.lt]: endDate,
                            }
                        },
                        {
                            endDate: {
                                [Op.gt]: endDate,
                                [Op.gt]: startDate,
                            }
                        },
                        {
                            carID: cars[i].carID
                        }
                    ]
                }});

            // Case which look like:  |  |
            //                        *
            let reservations5case = await reservation.findAndCountAll({where: {
                    [Op.and]: [
                        {
                            startDate: new Date(endDate)
                        },
                        {
                            carID: cars[i].carID
                        }
                    ]
                }});

            // console.log("1 case: " + reservations1case.count);
            // console.log("2 case: " + reservations2case.count);
            // console.log("3 case: " + reservations3case.count);
            // console.log("4 case: " + reservations4case.count);
            // console.log("5 case: " + reservations5case.count);

            if(reservations1case.count == 0
                && reservations2case.count == 0
                && reservations3case.count == 0
                && reservations4case.count == 0
                && reservations5case.count == 0){
                idSet.add(cars[i].carID);
            }
        }

        let idArray = await Array.from(idSet);

        let carsToSend = await car.findAll({where: {
            carID: Array.from(idArray)
            }});

        res.render("cars", { cars: carsToSend});
    }
});

module.exports = router;
