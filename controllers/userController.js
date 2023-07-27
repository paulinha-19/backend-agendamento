const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.find();
      if (users.length === 0) {
        return res.status(404).json({ message: "Nenhum usuário para listar" });
      }
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  getOneUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      if (user.length === 0) {
        return res.status(404).json({ message: "Nenhum usuário para listar" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  createUser: async (req, res) => {
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
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Nenhum usuário encontrado" });
      }
      const deletedUser = await userModel.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: `O usuário ${deletedUser.nome} foi deletado`,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Nenhum usuário encontrado" });
      }
      if (req.body.dataDeNascimento || req.body.cpf) {
        return res.status(400).json({
          success: false,
          message: "Não é permitido atualizar a data de nascimento ou CPF",
        });
      }

      const updateUser = await userModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({
        success: true,
        message: `O usuário ${updateUser.nome} foi atualizado`,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = userController;
