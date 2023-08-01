const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const userRoles = require("../utils/roles");

const userSchema = new Schema(
  {
    nome: {
      required: true,
      type: String,
      trim: true,
    },
    username: {
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      required: true,
      type: String,
      select: false,
    },
    cpf: {
      required: true,
      type: String,
      unique: true,
    },
    sexo: {
      required: true,
      type: String,
    },
    birth: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: userRoles,
      default: "patient",
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true, collection: "users" }
);

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

module.exports = mongoose.model("User", userSchema);
