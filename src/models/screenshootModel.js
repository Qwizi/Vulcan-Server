const {DataTypes} = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define("Screenshoot", {
        filename: DataTypes.STRING,
    })
}