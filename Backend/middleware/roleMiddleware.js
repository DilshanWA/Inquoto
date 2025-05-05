const { db } = require("../config/firebase");

const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    const uid = req.user.uid;

    try {
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data();

      if (!userDoc.exists || userData.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Error checking user role", error: error.message });
    }
  };
};

module.exports = roleMiddleware ;
