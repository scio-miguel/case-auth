const db = require("./config/database");
const User = db.users;

const user = {
  username: "Micky",
  hash: "12345",
  salt: "12341",
};

User.create(user)
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
