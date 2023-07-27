const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const userRoles = require("../utils/roles");

const userSchema = new Schema(
  {
    nome: {
      required: true,
      type: String,
    },
    username: {
      required: true,
      type: String,
      unique: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
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
  },
  { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
