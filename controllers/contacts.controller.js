const pool = require("../config/db");

/* ===============================
   INSERT CONTACT
=================================*/
exports.createContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO contacts (name, email, phone, message) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, email, phone, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/* ===============================
   GET CONTACTS (Pagination + Search + Sort)
=================================*/
exports.getContacts = async (req, res) => {
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
};