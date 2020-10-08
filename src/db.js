const {Sequelize, DataTypes} = require('sequelize');
require('dotenv').config({path: "../.env"});

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log
});

module.exports = sequelize;