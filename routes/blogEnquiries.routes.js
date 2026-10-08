const express = require("express");
const router = express.Router();

const blogEnquiriesController = require("../controllers/blogEnquiries.controller");

router.post("/", blogEnquiriesController.createBlogEnquiry);

module.exports = router;