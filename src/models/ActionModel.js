const {DataTypes} = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define("Action", {
        name: DataTypes.STRING,
        tag: DataTypes.STRING
    })
}