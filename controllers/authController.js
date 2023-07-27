const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  registerUser: async (req, res) => {
    const { nome, username, email, password, cpf, sexo, birth } = req.body;
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
      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.create({
        nome,
        username,
        email,
        password: hashedPassword,
        cpf,
        sexo,
        birth,
      });
      return res.status(201).json({
        success: true,
        message: `O usuário ${nome} foi registrado!`,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  loginUser: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.json({ message: "All fields are required" });
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Email not found" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({
        token: `Bearer ${token}`,
        message: "User logged in successfully",
        success: true,
        role: user.role,
        nome: user.nome,
        email: user.email,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong", error, success: false });
      next(error);
    }
  },
};

module.exports = authController;
