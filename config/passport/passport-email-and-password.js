const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const fs = require("fs");
const path = require("path");
const db = require("../database");
const User = db.users;

const pathToKey = path.join(__dirname, "../..", "id_rsa_pub.pem");
console.log(pathToKey);
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findOne({
        where: {
          id: jwt_payload.sub,
        },
      })
        .then(function (user) {
          if (!user) {
            return done(err, false);
          }
          return done(null, user.dataValues);
        })
        .catch((err) => done(err, false));
    })
  );
};
