const { Sequelize } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize("case_auth", "ackercoder", "", {
  host: "localhost",
  dialect: "postgres",
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("../models/user")(sequelize, Sequelize);

module.exports = db;
