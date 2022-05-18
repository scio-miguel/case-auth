const pool = require("../config/database");
const { genPassword } = require("../lib/utils");

const registerUser = async (uname, pw) => {
  const saltHash = genPassword(pw);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  try {
    await pool.query("BEGIN");
    const insertUserText =
      "INSERT INTO users(email, salt, hash) VALUES ($1, $2, $3)";
    const insertUserValues = [uname, salt, hash];
    await pool.query(insertUserText, insertUserValues);
    await pool.query("COMMIT");
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  } finally {
    pool.release();
  }
};

module.exports = { registerUser };
