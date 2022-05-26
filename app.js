const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");

require("dotenv").config();

var app = express();

require("./config/database");

require("./models/user");

const PORT = process.env.PORT;

require("./config/passport/passport-email-and-password")(passport);
require("./config/passport/passport-passwordless")(passport);
// require("./config/passport/passport-google")(passport);
// require("./config/passport/passport-microsoft")(passport);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(require("./routes"));
app.listen(8080);
