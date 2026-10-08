const pool = require("../config/db");

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const admin = result.rows[0];

    if (admin.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};