var sequelize = require('../connect.js');
var Sequelize = require('sequelize');
sequelize.sync();

let User = sequelize.define('Users', {
    userID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    facebookID: Sequelize.STRING,
    name: Sequelize.STRING
});

module.exports = User;
