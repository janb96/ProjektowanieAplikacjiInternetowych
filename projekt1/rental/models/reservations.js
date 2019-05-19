var sequelize = require('../connect.js');
var Sequelize = require('sequelize');
sequelize.sync();

let Reservations = sequelize.define('Reservations', {
    reservationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: Sequelize.STRING,
    carID: Sequelize.STRING,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    price: Sequelize.INTEGER,
    isConfirmed: Sequelize.BOOLEAN
});

module.exports = Reservations;
