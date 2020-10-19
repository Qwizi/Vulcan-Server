const {DataTypes} = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define("Host", {
        name: DataTypes.STRING,
        tag: DataTypes.STRING,
        alias: DataTypes.STRING,
    })
}