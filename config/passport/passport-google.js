var GoogleStrategy = require("passport-google-oauth2").Strategy;
const db = require("../database");
const User = db.users;

const options = {
  clientID:
    "279671161471-hqsgstqqgb9ulvj505erullcba61lqjn.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:8080/users/auth/google/callback",
  passReqToCallback: true,
};

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(options, function (
      request,
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      console.log(profile);
      User.findOrCreate({
        where: {
          google_id: profile.id,
        },
      })
        .then((user) => {
          console.log(user.dataValues);
          if (!user) {
            return "User not found";
          }
          return user;
        })
        .catch((err) => console.log(err));
    })
  );
};
