const pool = require("../config/db");
const slugify = require("slugify");

/* ===============================
   CREATE BLOG
=================================*/
exports.createBlog = async (req, res) => {

  const {
    title,
    slug,
    excerpt,
    content,
    author,
    status,
    meta_title,
    meta_description
  } = req.body;

  let featured_image = null;

    if (req.file) {
      featured_image = req.file.filename;
    }
  const query = `
    INSERT INTO blogs
    (title, slug, excerpt, content, featured_image, author, status, meta_title, meta_description,featured_image)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,COALESCE($9, featured_image))
    RETURNING *
  `;

  const values = [
    title,
    slug,
    excerpt,
    content,
    featured_image,
    author,
    status,
    meta_title,
    meta_description
  ];

  const result = await pool.query(query, values);

  res.json(result.rows[0]);

};

/* ===============================
   GET ALL BLOGS (ADMIN)
=================================*/
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

/* ===============================
   UPDATE BLOG
=================================*/
exports.updateBlog = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      slug,
      excerpt,
      content,
      author,
      status,
      meta_title,
      meta_description
    } = req.body;

    let featured_image = null;

    if (req.file) {
      featured_image = req.file.filename;
    }

    const query = `
      UPDATE blogs SET
        title=$1,
        slug=$2,
        excerpt=$3,
        content=$4,
        author=$5,
        status=$6,
        meta_title=$7,
        meta_description=$8,
        featured_image = COALESCE($9, featured_image)
      WHERE id=$10
      RETURNING *
    `;

    const values = [
      title,
      slug,
      excerpt,
      content,
      author,
      status,
      meta_title,
      meta_description,
      featured_image,
      id
    ];

    const result = await pool.query(query, values);

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   DELETE BLOG
=================================*/
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM blogs WHERE id=$1", [id]);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

/* ===============================
   PUBLIC BLOG LIST
=================================*/
exports.getPublishedBlogs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blogs WHERE status='published' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);  // log the actual error
    res.status(500).send("Server Error");
  }
};

/* ===============================
   PUBLIC SINGLE BLOG
=================================*/
exports.getSingleBlog = async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM blogs WHERE slug=$1 AND status='published'",
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getSingleBlogAdmin = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM blogs WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }
};