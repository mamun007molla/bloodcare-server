const stripe  = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getCol } = require("../config/db");

// POST /create-payment-checkout
const createCheckout = async (req, res, next) => {
  try {
    const { donateAmount, donorName, donorEmail } = req.body;

    if (!donateAmount || !donorEmail) {
      return res.status(400).json({ error: true, message: "Amount and email are required" });
    }

    const amount = parseInt(donateAmount) * 100;
    if (isNaN(amount) || amount < 50) {
      return res.status(400).json({ error: true, message: "Minimum donation is $0.50" });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: "Donation to BloodCare",
            description: `Donation from ${donorName} (${donorEmail})`,
          },
        },
        quantity: 1,
      }],
      mode: "payment",
      metadata: { donorName: donorName || "Anonymous" },
      customer_email: donorEmail,
      success_url: `${process.env.SITE_DOMAIN}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.SITE_DOMAIN}/funding`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// POST /payment-success — called after Stripe redirect
const paymentSuccess = async (req, res, next) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ error: true, message: "session_id is required" });
    }

    const session       = await stripe.checkout.sessions.retrieve(session_id);
    const transactionId = session.payment_intent;

    if (session.payment_status !== "paid") {
      return res.status(402).json({ error: true, message: "Payment not completed" });
    }

    const payColl = getCol("payments");   // ✅ Fixed: was donationColl (undefined)

    // Prevent duplicate records
    const existing = await payColl.findOne({ transactionId });
    if (existing) {
      return res.json({ success: true, message: "Payment already recorded", result: existing });
    }

    const paymentInfo = {
      amount:         session.amount_total / 100,
      currency:       session.currency,
      transactionId,
      donorEmail:     session.customer_email,
      donorName:      session.metadata?.donorName || "Anonymous",
      payment_status: session.payment_status,
      paidAt:         new Date(),
    };

    const result = await payColl.insertOne(paymentInfo);
    res.json({ success: true, message: "Payment recorded", result });
  } catch (err) {
    next(err);
  }
};

// GET /payments — all payments (admin)
const getAllPayments = async (req, res, next) => {
  try {
    const payColl = getCol("payments");
    const result  = await payColl.find().sort({ paidAt: -1 }).toArray();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { createCheckout, paymentSuccess, getAllPayments };
