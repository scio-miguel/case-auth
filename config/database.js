const { Sequelize } = require("sequelize");

require("dotenv").config();

const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  port: DB_PORT,
  ssl: true,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("../models/user")(sequelize, Sequelize);

module.exports = db;
