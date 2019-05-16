var Sequelize = require('sequelize');
var sequelize = new Sequelize('rental', 'root', 'onyks1234', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
        insecureAuth: true,
    },
    define: {
        timestamps: false
    }
});

module.exports = sequelize;