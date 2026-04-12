const express = require("express");
const router  = express.Router();
const { searchDonors } = require("../controllers/donorController");

router.get("/", searchDonors);

module.exports = router;
