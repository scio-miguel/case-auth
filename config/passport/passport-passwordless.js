const MagicLinkStrategy = require("passport-magic-link").Strategy;
const db = require("../database");
const User = db.users;
const utils = require("../../lib/utils");
require("dotenv").config();

const MAGICLINK_SECRET = process.env.MAGICLINK_SECRET;
const WEB_PORTAL_MAGICLINK = process.env.FE_MAGICLINK;

const options = {
  secret: MAGICLINK_SECRET,
  userFields: ["username"],
  tokenField: "token",
  verifyUserAfterToken: true,
  ttl: 10,
};

module.exports = (passport) => {
  passport.use(
    new MagicLinkStrategy(
      options,
      async (user, token) => {
        const userFound = await User.findOne({
          where: { username: user.username },
        });
        const link =
          WEB_PORTAL_MAGICLINK +
          "?username=" +
          user.username +
          "&token=" +
          token;
        utils.sendSMS(userFound.dataValues.phone_number, link);
        return link;
      },
      function verify(user) {
        User.findOne({
          where: {
            username: user.username,
          },
        })
          .then((user) => {
            if (!user) {
              return "User not found";
            }
            return user;
          })
          .catch((err) => console.log(err));
      }
    )
  );
};
