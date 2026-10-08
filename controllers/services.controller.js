const pool = require("../config/db");

exports.getAllServices = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM services ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};