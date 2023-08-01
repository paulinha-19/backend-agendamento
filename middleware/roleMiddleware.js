const userSchema = require("../models/userSchema");

exports.roleMiddleware = (roles) => {
  return async (req, res, next) => {
    const { nome } = req.body;
    const user = await userSchema.findOne({ nome });
    !roles.includes(user.role)
      ? res.status(401).json("Sorry you do not have access to this route")
      : next();
  };
};
