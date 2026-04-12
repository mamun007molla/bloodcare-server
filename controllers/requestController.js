const { getCol } = require("../config/db");
const { ObjectId } = require("mongodb");

// POST /requests
const createRequest = async (req, res, next) => {
  try {
    const {
      requesterName, requesterEmail, recipientName,
      recipientDistrict, recipientUpazila, hospitalName,
      address, donationDate, donationTime, bloodGroup, requestMessage,
    } = req.body;

    if (!requesterEmail || !recipientName || !bloodGroup || !donationDate) {
      return res.status(400).json({ error: true, message: "Missing required fields" });
    }

    const requestColl = getCol("requests");
    const result = await requestColl.insertOne({
      requesterName, requesterEmail, recipientName,
      recipientDistrict, recipientUpazila, hospitalName,
      address, donationDate, donationTime, bloodGroup, requestMessage,
      donationStatus: "pending",
      createdAt: new Date(),
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// GET /requests/pending — public
const getPendingRequests = async (req, res, next) => {
  try {
    const requestColl = getCol("requests");
    const result = await requestColl
      .find({ donationStatus: "pending" })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /requests/:id — single request
const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: true, message: "Invalid request ID" });
    }
    const requestColl = getCol("requests");
    const result      = await requestColl.findOne({ _id: new ObjectId(id) });
    if (!result) return res.status(404).json({ error: true, message: "Request not found" });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /requests/user/:email — user's own requests
const getRequestsByUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const page   = parseInt(req.query.page)   || 1;
    const size   = parseInt(req.query.size)   || 10;
    const status = req.query.status           || "all";

    const query = { requesterEmail: email };
    if (status !== "all") query.donationStatus = status;

    const requestColl = getCol("requests");
    const total  = await requestColl.countDocuments(query);
    const result = await requestColl
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .toArray();

    res.json({ total, result });
  } catch (err) {
    next(err);
  }
};

// GET /requests — all requests with pagination & filter
const getAllRequests = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)   || 1;
    const size   = parseInt(req.query.size)   || 10;
    const status = req.query.status           || "all";

    const query = {};
    if (status !== "all") query.donationStatus = status;

    const requestColl = getCol("requests");
    const total  = await requestColl.countDocuments(query);
    const result = await requestColl
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .toArray();

    res.json({ total, result });
  } catch (err) {
    next(err);
  }
};

// DELETE /requests/:id
const deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: true, message: "Invalid request ID" });
    }
    const requestColl = getCol("requests");
    const result      = await requestColl.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// PATCH /requests/update-status/:id
const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { donationStatus } = req.body;

    const VALID = ["pending", "inprogress", "done", "canceled"];
    if (!VALID.includes(donationStatus)) {
      return res.status(400).json({ error: true, message: "Invalid status value" });
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: true, message: "Invalid request ID" });
    }

    const requestColl = getCol("requests");
    const result      = await requestColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: { donationStatus } }
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// PATCH /requests/:id — update full request
const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: true, message: "Invalid request ID" });
    }
    const updateData = { ...req.body };
    delete updateData._id;

    const requestColl = getCol("requests");
    const result      = await requestColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const userColl    = getCol("users");
    const requestColl = getCol("requests");
    const payColl     = getCol("payments");

    const [totalDonors, totalRequests, payments] = await Promise.all([
      userColl.countDocuments({ role: "donor" }),
      requestColl.countDocuments(),
      payColl.find().toArray(),
    ]);

    const totalFunding = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({ totalDonors, totalRequests, totalFunding });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRequest, getPendingRequests, getRequestById,
  getRequestsByUser, getAllRequests, deleteRequest,
  updateRequestStatus, updateRequest, getDashboardStats,
};
