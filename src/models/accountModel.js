const {DataTypes} = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define("Account", {
        username: DataTypes.STRING,
        password: DataTypes.STRING
    })
}