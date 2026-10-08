const express = require("express");
const router = express.Router();
const contactsController = require("../controllers/contacts.controller");

router.post("/", contactsController.createContact);
router.get("/", contactsController.getContacts);

module.exports = router;