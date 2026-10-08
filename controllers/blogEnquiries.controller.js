const pool = require("../config/db");

/* ===============================
   INSERT BLOG ENQUIRY
=================================*/
exports.createBlogEnquiry = async (req, res) => {
  const {
    name,
    email,
    phone,
    message,
    blog_url,
  } = req.body;

  // Basic validation
  if (!name || !email || !phone || !blog_url) {
    return res.status(400).json({
      message: "Name, email, phone and blog URL are required",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  // Phone validation
  const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      message: "Please enter a valid phone number",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO blog_enquiries
        (name, email, phone, message, blog_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name.trim(),
        email.trim(),
        phone.trim(),
        message ? message.trim() : null,
        blog_url.trim(),
      ]
    );

    res.status(201).json({
      message: "Blog enquiry submitted successfully",
      enquiry: result.rows[0],
    });
  } catch (err) {
    console.error("Blog enquiry error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};