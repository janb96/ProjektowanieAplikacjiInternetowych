var express = require('express');
var router = express.Router();
var reservation = require('../models/reservations.js');
var user = require('../models/users.js');
var car = require('../models/cars.js');
var sequelize = require('../connect.js');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.get('/', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }

    res.render("reservations", {alert: ""});
});

router.get('/delete/:id', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }

    reservation.destroy({where:
            {
                reservationID: req.params.id
            }
    });

    res.redirect("/");
});

router.get('/confirm/:id', function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/');
    }

    reservation.update(
        {
            isConfirmed: true
        },
        {
            where:
            {
                reservationID: req.params.id
            }
        }
    );

    res.redirect("/admin/manage-reservations");
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

    let my_reservations = [];

    for(let i = 0; i < reservations.length; i++){
        let cars = await car.findAll( {where:
                {
                    carID: reservations[i].carID
                }
        });

        let start = new Date(reservations[i].startDate);
        let end = new Date(reservations[i].endDate);
        let oneDay = 24*60*60*1000;
        let diffDays = Math.round(Math.abs((end.getTime() - start.getTime())/(oneDay)));

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

    if(my_reservations.length == 0){
        noReservations = true;
    }

    res.render("my-reservations",
        {
            noReservations: noReservations,
            reservations: my_reservations
        });
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
                price: req.params.price,
                isConfirmed: false
            });
        }

        res.redirect('/reservations/my-reservations');
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

        let noCars = false;

        if(carsToSend.length == 0){
            noCars = true;
        }

        res.render("cars", {
            noCars: noCars,
            cars: carsToSend,
            startDate: startDate,
            endDate: endDate,
            diffDays: diffDays,
            facebookID: req.user.id
        });

    }
});

module.exports = router;
