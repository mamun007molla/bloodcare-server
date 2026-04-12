const express    = require("express");
const router     = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { submitContact, getAllContacts } = require("../controllers/contactController");

router.post("/",           submitContact);
router.get("/", verifyToken, getAllContacts);

module.exports = router;
