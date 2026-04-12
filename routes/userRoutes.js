const express    = require("express");
const router     = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createUser, getAllUsers, getUserByEmail,
  updateUserById, updateUserByEmail,
} = require("../controllers/userController");

router.post("/",                       createUser);
router.get("/",          verifyToken,  getAllUsers);
router.get("/role/:email",             getUserByEmail);
router.patch("/update/:id",            updateUserById);          // update by _id
router.patch("/update-by-email/:email", updateUserByEmail);     // update by email (no conflict)

module.exports = router;
