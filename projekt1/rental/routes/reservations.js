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
    let start = new Date(startDate);
    let end = new Date(endDate);
    let oneDay = 24*60*60*1000;
    let diffDays = Math.round(Math.abs((end.getTime() - start.getTime())/(oneDay)));

    console.log(startDate + " " + endDate);

    let idSet = new Set();
    if(startDate >= endDate){
        res.render("reservations", {alert: "Pick-up date is cannot be later than return date"});
    } else {
        let cars = await car.findAll();
        cars.forEach(async function(car){

            // Case which look like: * | * |
            let reservations1case = await reservation.findAndCountAll({where: {
                    [Op.and]: [
                        {
                            startDate: {
                                [Op.gt]: startDate,
                                [Op.lt]: endDate
                            }
                        },
                        {
                            endDate: {
                                [Op.gt]: endDate
                            }
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
                        }
                    ]
                }});

            console.log("1 case: " + reservations1case.count);
            console.log("2 case: " + reservations2case.count);
            console.log("3 case: " + reservations3case.count);
            console.log("4 case: " + reservations4case.count);


            // reservation.findAll()
            // console.log(diffDays);
            // idSet.add(car.carID);
        });
        console.log(idSet);
        // res.render("cars", {cars: cars});
        res.render("reservations", {alert: ""});
    }
});

module.exports = router;
