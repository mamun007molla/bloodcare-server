const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createRequest, getPendingRequests, getRequestById,
  getRequestsByUser, getAllRequests, deleteRequest,
  updateRequestStatus, updateRequest,
} = require("../controllers/requestController");

// Specific routes BEFORE /:id
router.get("/pending",        getPendingRequests);
router.get("/user/:email",    getRequestsByUser);
router.get("/",               getAllRequests);
router.post("/", verifyToken, createRequest);
router.patch("/update-status/:id", updateRequestStatus);
router.patch("/:id",          updateRequest);
router.delete("/:id",         deleteRequest);
router.get("/:id",            getRequestById);

module.exports = router;
