const { admin } = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ error: true, message: "Unauthorized: No token provided" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded_email = decoded.email;
    next();
  } catch {
    return res.status(401).json({ error: true, message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = verifyToken;
