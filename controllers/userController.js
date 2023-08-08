const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

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
  confirmEmail: async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "E-mail não encontrado" });
      }
  
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Código OTP inválido" });
      }
  
      user.emailVerified = true;
      user.otp = null;
      await user.save();
  
      return res.status(200).json({ success: true, message: "E-mail confirmado com sucesso" });
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

      const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
      await userModel.findByIdAndUpdate(userId, { otp });
      await newUser.save();
      
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
  forgotUser: async (req, res) =>{
    const { email } = req.body;

    try {
      const user = await userModel.findOne({ email });
      
      if(!user) {
        return res.status(404).json({ message: "E-mail não encontrado" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex"); 
      const now = new Date(); now.setHours(now.getHours() + 1);
      await userModel.findByIdAndUpdate(user._id, { $set: { passwordResetToken: resetToken, passwordResetExpires: now, }, });

      user.resetPasswordToken  = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000;

      const transporter = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        secure: false,
        auth: {
          user: "seu_email@example.com",
          pass: "sua_senha_do_email",
        },
      });

      const mailOptions = {
        from: "seu_email@example.com",
        to: email,
        subject: "Recuperação de Senha",
        html: `<p>Olá ${user.nome},</p><p>Você solicitou a redefinição da sua senha. Clique no link abaixo para criar uma nova senha:</p><p><a href="http://seu_site.com/resetPassword/${resetToken}">Redefinir Senha</a></p><p>Se você não solicitou a redefinição de senha, ignore este e-mail.</p>`,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: "E-mail enviado com sucesso" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = userController;
