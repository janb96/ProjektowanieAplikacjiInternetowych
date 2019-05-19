var express = require('express');
var router = express.Router();
var reservation = require('../models/reservations.js');
var user = require('../models/users.js');
var car = require('../models/cars.js');
var sequelize = require('../connect.js');
var Sequelize = require('sequelize');
const Op = Sequelize.Op


router.get('/', async function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }
    res.render("reservations", {alert: ""});
});

router.get('/my-reservations', async function(req, res, next) {

    if(!req.isAuthenticated()){
        res.redirect('/');
    }

    let users = await user.findAll({where:
            {
                facebookID: req.user.id
            }
    });

    console.log(users[0].userID);

    let reservations = await reservation.findAll({where:
            {
                userID: users[0].userID
            }
    });



    res.send(reservations);
});

router.get('/rent/:carID/:startDate/:endDate/:price/:facebookID', async function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }

    let facebookID = req.user.id;

    if(facebookID == req.params.facebookID){
        let users_quantity = await user.findAndCountAll({where: {facebookID: facebookID}});

        if(users_quantity.count == 1){
            let users = await user.findAll({where: {facebookID: facebookID}});
            reservation.create({
                userID: users[0].userID,
                carID: req.params.carID,
                startDate: req.params.startDate,
                endDate: req.params.endDate,
                price: req.params.price
            });
        }

        res.render("reservations", {alert: "OKSSS"});
    } else {
        res.redirect('/');
    }
});

router.post('/', async function(req, res, next){
    if(!req.isAuthenticated()){
        res.redirect('/');
    }

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    let start = new Date(startDate);
    let end = new Date(endDate);
    let oneDay = 24*60*60*1000;
    let diffDays = Math.round(Math.abs((end.getTime() - start.getTime())/(oneDay)));

    console.log(diffDays);

    if(startDate >= endDate){
        res.render("reservations", {alert: "Pick-up date is cannot be later than return date"});
    } else {
        let cars = await car.findAll();
        let idSet = new Set();

        for(let i=0; i < cars.length; i++){

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

        res.render("cars", {
            cars: carsToSend,
            startDate: startDate,
            endDate: endDate,
            diffDays: diffDays,
            facebookID: req.user.id
        });

    }
});

module.exports = router;
