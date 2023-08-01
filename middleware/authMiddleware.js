const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");

const authMiddleware = (roles) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
      return res
        .status(401)
        .json({ auth: false, message: "Access Denied. No token provided" });

    const parts = authorization.split(" ");
    if (!parts.length === 2)
      return res.status(401).json({ auth: false, message: "Token error" });
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme))
      return res
        .status(401)
        .json({ auth: false, message: "Token malformatted" });

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err)
        return res.status(401).json({
          auth: false,
          message: "Token invalid",
          error: err.message,
        });
      const user = await userModel.findById(decoded.id);
      if (!roles.includes(user.role))
        return res.status(403).json({
          message: "Unauthorized. You do not have access to this route",
        });

      req.userId = decoded.id;
      req.role = user.role;
      return next();
    });
  };
};
module.exports = authMiddleware;
