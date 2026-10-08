require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const slugify = require("slugify");
const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Get all services
app.get("/services", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



/* ===============================
   INSERT CONTACT
=================================*/
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO contacts (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


app.get("/contacts", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "id";
  const order =
  req.query.order &&
  req.query.order.toLowerCase() === "asc"
    ? "ASC"
    : "DESC";

  const offset = (page - 1) * limit;

  // ✅ VERY IMPORTANT – whitelist fields
  const allowedFields = ["id", "name", "email", "created_at"];

  const safeSortField = allowedFields.includes(sortBy)
    ? sortBy
    : "id";

  try {
    const dataQuery = `
      SELECT *
      FROM contacts
      WHERE name ILIKE $1
         OR email ILIKE $1
         OR message ILIKE $1
      ORDER BY "${safeSortField}" ${order}
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM contacts
      WHERE name ILIKE $1
         OR email ILIKE $1
         OR message ILIKE $1
    `;

    const data = await pool.query(dataQuery, [
      `%${search}%`,
      limit,
      offset,
    ]);

    const count = await pool.query(countQuery, [
      `%${search}%`,
    ]);

    res.json({
      contacts: data.rows,
      total: parseInt(count.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = result.rows[0];

    // ⚠️ For now comparing plain text (since your DB has plain password)
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
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
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});