var sequelize = require('../connect.js');
var Sequelize = require('sequelize');
sequelize.sync();

let Car = sequelize.define('Cars', {
    carID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    brand: Sequelize.STRING,
    model: Sequelize.STRING,
    pricePerDay: Sequelize.INTEGER,
    photo1: Sequelize.STRING,
    photo2: Sequelize.STRING,
    plates: Sequelize.STRING
});

module.exports = Car;