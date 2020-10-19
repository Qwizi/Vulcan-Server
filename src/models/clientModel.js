const {DataTypes} = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define("Client", {
        sid: DataTypes.STRING,
    })
}