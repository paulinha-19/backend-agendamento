const mongoose = require("mongoose");
require("dotenv").config();
async function main() {
  try {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected ACME");
  } catch (error) {
    console.log(`Erro: ${error}`);
  }
}

module.exports = main;
