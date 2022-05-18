const router = require("express").Router();
const passport = require("passport");
const utils = require("../lib/utils");
const db = require("../config/database");
const User = db.users;

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: "You are successfully authenticated to this route!",
    });
  }
);

router.post(
  "/auth/magiclink",
  passport.authenticate("magiclink", { action: "requestToken" }),
  (req, res) =>
    res.status(200).json({
      success: true,
      msg: "You are successfully authenticated to this route!",
    })
);

router.post("/login", function (req, res, next) {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(function (user) {
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "could not find user" });
      }
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    })
    .catch((err) => {
      next(done(err));
    });
});

router.post("/register", function (req, res, next) {
  const saltHash = utils.genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = {
    username: req.body.username,
    hash: hash,
    salt: salt,
  };

  try {
    User.create(newUser).then((user) => {
      const tokenObject = utils.issueJWT(user);
      res.json({
        success: true,
        user: user,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    });
  } catch (err) {
    res.json({ success: false, msg: err });
  }
});

module.exports = router;
