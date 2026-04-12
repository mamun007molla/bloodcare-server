const { getCol } = require("../config/db");
const { ObjectId } = require("mongodb");

// POST /users — register new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, photoURL, blood, district, subDistrict } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: true, message: "Name and email are required" });
    }

    const userColl = getCol("users");

    // Prevent duplicates
    const existing = await userColl.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: true, message: "User already exists" });
    }

    const result = await userColl.insertOne({
      name, email, photoURL, blood, district, subDistrict,
      role: "donor",
      status: "active",
      createdAt: new Date(),
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// GET /users — all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const userColl = getCol("users");
    const result   = await userColl.find().toArray();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /users/role/:email — get user role & status
const getUserByEmail = async (req, res, next) => {
  try {
    const userColl = getCol("users");
    const result   = await userColl.findOne({ email: req.params.email });
    res.json(result || { role: null, status: null });
  } catch (err) {
    next(err);
  }
};

// PATCH /users/update/:id — update by MongoDB _id
const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: true, message: "Invalid user ID" });
    }

    delete updateData._id;

    const userColl = getCol("users");
    const result   = await userColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/update-by-email/:email — update by email
const updateUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    delete updateData._id;

    const userColl = getCol("users");
    const result   = await userColl.updateOne(
      { email },
      { $set: updateData }
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, getAllUsers, getUserByEmail, updateUserById, updateUserByEmail };
