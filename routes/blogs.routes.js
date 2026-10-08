const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogs.controller");
const upload = require("../middlewares/upload");

/* CREATE BLOG */
router.post("/", upload.single("featured_image"), blogController.createBlog);

/* ADMIN ROUTES */
router.get("/", blogController.getAllBlogsAdmin);
router.get("/:id", blogController.getSingleBlogAdmin);
router.put("/:id", upload.single("featured_image"), blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

/* PUBLIC ROUTES */
router.get("/published", blogController.getPublishedBlogs);
router.get("/:slug", blogController.getSingleBlog);

module.exports = router;