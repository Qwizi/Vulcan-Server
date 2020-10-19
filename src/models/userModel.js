const {DataTypes} = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.STRING
    })
}