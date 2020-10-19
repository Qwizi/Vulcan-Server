const {DataTypes} = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define("Cookie", {
        name: DataTypes.STRING,
        value: DataTypes.STRING,
        domain: DataTypes.STRING,
        path: DataTypes.STRING,
        secure: DataTypes.TINYINT,
        expires: DataTypes.DATE
    })
}