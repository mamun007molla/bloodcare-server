const express    = require("express");
const router     = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { createCheckout, paymentSuccess, getAllPayments } = require("../controllers/paymentController");

router.post("/create-payment-checkout", createCheckout);
router.post("/payment-success",         paymentSuccess);
router.get("/payments", verifyToken,    getAllPayments);

module.exports = router;
