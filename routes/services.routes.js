const express = require("express");
const router = express.Router();
const servicesController = require("../controllers/services.controller");

router.get("/", servicesController.getAllServices);

module.exports = router;