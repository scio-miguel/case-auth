const MicrosoftStrategy = require("passport-microsoft").Strategy;
const user = require("../../models/user");
const db = require("../database");
const User = db.users;

const options = {
  clientID: "5bbdc891-0eca-4a4b-94d1-f6f8d867e9ed",
  clientSecret: "1p78Q~NtDFlV__JmeyBYpwCrcXBcYrrjMyq4TduF",
  callbackURL: "http://localhost:8080/users/auth/microsoft/callback",
  scope: ["user.read"],
  tenant: "consumers",
  authorizationURL:
    "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize",
  tokenURL: "https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
};

module.exports = (passport) => {
  passport.use(
    new MicrosoftStrategy(options, function (
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      console.log(profile);
      User.findOrCreate({ microsoft_id: profile.id }).then((user) => {
        console.log(user);
      });
    })
  );
};
