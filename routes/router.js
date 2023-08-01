const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const middlewareValidate = require("../middleware/validationSchema");
const userSchema = require("../validation/userSchema");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", (_, res) => {
  return res.json("Bem vindo a API ACME");
});
router.get("/auth", authMiddleware(["admin", "patient"]), async (req, res) => {
  return res.json({
    message: "You have access to this protected route",
    user: req.userId,
    role: req.role,
  });
});
// router.get("/users", userController.getAllUsers);
// router.get("/user/:id", userController.getOneUser);
router.post(
  "/register",
  middlewareValidate(userSchema),
  authController.registerUser
);
router.post("/login", authController.loginUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword)

// router.delete("/user/:id", userController.deleteUser);
// router.patch(
//   "/user/:id",
//   middlewareValidate(updateUserSchema),
//   userController.updateUser
// );

module.exports = router;
