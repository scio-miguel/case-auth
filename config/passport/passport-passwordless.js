const MagicLinkStrategy = require("passport-magic-link").Strategy;
const db = require("../database");
const User = db.users;
const utils = require("../../lib/utils");
require("dotenv").config();

const MAGICLINK_SECRET = process.env.MAGICLINK_SECRET;
const WEB_PORTAL_MAGICLINK = process.env.WEB_PORTAL_MAGICLINK;

const options = {
  secret: MAGICLINK_SECRET,
  userFields: ["username"],
  tokenField: "token",
  verifyUserAfterToken: true,
};

module.exports = (passport) => {
  passport.use(
    new MagicLinkStrategy(
      options,
      async function send(user, token) {
        const userFound = await User.findOne({
          where: { username: user.username },
        });
        console.log("USER", user);
        const link =
          WEB_PORTAL_MAGICLINK +
          "?username=" +
          user.username +
          "&token=" +
          token;
        console.log(typeof User.findOne);
        utils.sendSMS(userFound.dataValues.phone_number, link);
        console.log(link);
        return link;
      },
      function verify(user) {
        const { username } = user;
        return username;
      }
    )
  );
};
