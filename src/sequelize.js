const {Sequelize, DataTypes} = require('sequelize');
require('dotenv').config({path: "../.env"});

const UserModel = require('./models/userModel');
const ClientModel = require('./models/clientModel');
const CookieModel = require('./models/cookieModel');
const ScreenshootModel = require('./models/screenshootModel');
const HostModel = require('./models/hostModel');
const ActionModel = require('./models/actionModel');
const AccountModel = require('./models/accountModel');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log
});

const User = UserModel(sequelize, Sequelize);
const Client = ClientModel(sequelize, Sequelize);
const Cookie = CookieModel(sequelize, Sequelize);
const Screenshoot = ScreenshootModel(sequelize, Sequelize);
const Host = HostModel(sequelize, Sequelize);
const Action = ActionModel(sequelize, Sequelize);
const Account = AccountModel(sequelize, Sequelize);


// Powiazania

Client.Cookies = Client.hasMany(Cookie);
Cookie.Client = Cookie.belongsTo(Client);

Client.ScreenShoots = Client.hasMany(Screenshoot);
Screenshoot.Client = Screenshoot.belongsTo(Client);

Host.Actions = Host.hasMany(Action);
Action.Host = Action.belongsTo(Host);

Host.Accounts = Host.hasMany(Account);
Account.Host = Account.belongsTo(Host);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    //await sequelize.sync({force: true});
    await sequelize.sync({force: false});
    console.log("All models were synchronized successfully.");
})();

module.exports = {
    User,
    Client,
    Cookie,
    Screenshoot,
    Host,
    Action,
    Account
}