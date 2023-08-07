const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();
const middlewareValidate = require("../middleware/validationSchema");
const userSchema = require("../validation/userSchema");
const updateUserSchema = require("../validation/updateUserSchema");

router.get("/", (_, res) => {
  return res.json("Bem vindo a API ACME");
});
// router.get("/users", userController.getAllUsers);
// router.get("/user/:id", userController.getOneUser);
router.post(
  "/register",
  middlewareValidate(userSchema),
  authController.registerUser
);
router.post(
  "/login",
  authController.loginUser
);
router.post(
  "/confirm-email", 
  userController.confirmEmail);
// router.delete("/user/:id", userController.deleteUser);
// router.patch(
//   "/user/:id",
//   middlewareValidate(updateUserSchema),
//   userController.updateUser
// );

module.exports = router;
