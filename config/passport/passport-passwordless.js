const MagicLinkStrategy = require("passport-magic-link").Strategy;
const fs = require("fs");
const path = require("path");
const db = require("../database");
const User = db.users;

const pathToKey = path.join(__dirname, "../..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  secret: PUB_KEY,
  userFields: ["username"],
  tokenField: "token",
};

module.exports = (passport) => {
  passport.use(
    new MagicLinkStrategy(
      options,
      (user, token) => {
        console.log(token);
        User.findOne({
          where: {
            username: user.username,
          },
        })
          .then(function (userFound) {
            if (!userFound) {
              return done(err, false);
            }
            return done(null, token);
          })
          .catch((err) => done(err, false));
      },
      (user) => {
        User.findOne({
          where: {
            id: user.id,
          },
        })
          .then(function (user) {
            if (!user) {
              return done(err, false);
            }
            return done(null, user.dataValues);
          })
          .catch((err) => done(err, false));
      }
    )
  );
};
