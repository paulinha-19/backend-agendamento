const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const authController = {
  registerUser: async (req, res) => {
    const { nome, username, email, cpf } = req.body;
    try {
      const cpfExists = await userModel.findOne({ cpf });
      const emailExists = await userModel.findOne({ email });
      const userNameExists = await userModel.findOne({ username });
      if (cpfExists || emailExists || userNameExists) {
        return res.status(400).json({
          success: false,
          message: `O username: ${username} e/ou email: ${email} e/ou cpf: ${cpf} já existe no banco de dados. `,
        });
      }
      const user = await userModel.create(req.body);
      return res.status(201).json({
        success: true,
        message: `O usuário ${nome} foi registrado!`,
        token: generateToken({ id: user._id }),
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  loginUser: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const user = await userModel.findOne({ email }).select("+password");
      if (!user)
        return res
          .status(400)
          .json({ message: "Email or password invalid", success: false });

      if (!(await bcrypt.compare(password, user.password)))
        return res.status(400).json({ message: "Incorrect password" });
      res.status(200).json({
        token: generateToken({ id: user._id }),
        message: `User ${user.nome} logged in successfully`,
        success: true,
        role: user.role,
        nome: user.nome,
      });
    } catch (error) {
      res.status(500).json({ message: "Login error", error, success: false });
      next(error);
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!email || !user)
        return res
          .status(400)
          .json({ message: "Email not found or invalid", success: false });
    } catch (error) {
      res.status(400).json({
        message: "Erro on forgot password, try again",
        error,
        success: false,
      });
      next(error);
    }
  },
  resetPassword: async (req, res) => {
    const { email, password, token } = req.body;
    try {
      const user = await userModel
        .findOne({ email })
        .select("+passwordResetToken passwordResetExpires");
      if (!user)
        return res
          .status(400)
          .json({ message: "User not found", success: false });

      if (token !== user.passwordResetToken)
        return res
          .status(400)
          .json({ message: "Token invalid", success: false });

      const now = new Date();
      if (now > user.passwordResetExpires)
        return res
          .status(400)
          .json({ message: "Token expired", success: false });

      user.password = password;
      await user.save();

      return res
        .status(200)
        .json({ message: "Password reseted", success: true });
    } catch (error) {
      res.status(400).json({
        message: "Erro on reset password, try again",
        error,
        success: false,
      });
    }
  },
};

module.exports = authController;
