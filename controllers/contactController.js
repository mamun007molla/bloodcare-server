const { getCol } = require("../config/db");

// POST /contact — store contact message in DB
const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: true, message: "Name, email, and message are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: true, message: "Invalid email address" });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ error: true, message: "Message must be at least 10 characters" });
    }

    const contactColl = getCol("contacts");
    const result = await contactColl.insertOne({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      message: message.trim(),
      status:  "unread",
      sentAt:  new Date(),
    });

    res.status(201).json({ success: true, message: "Message received! We'll get back to you shortly.", result });
  } catch (err) {
    next(err);
  }
};

// GET /contact — all messages (admin)
const getAllContacts = async (req, res, next) => {
  try {
    const contactColl = getCol("contacts");
    const result      = await contactColl.find().sort({ sentAt: -1 }).toArray();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact, getAllContacts };
