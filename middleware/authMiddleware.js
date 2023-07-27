const jwt = require("jsonwebtoken");
const userModel = require("./user");

exports.authorizeUser = (roles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const user = await userModel.findById(decodedToken.userId).select("role");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
