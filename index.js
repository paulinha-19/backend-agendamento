const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const conn = require("./db/conn");
const routes = require("./routes/router");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
conn();
app.use("/api", routes);
app.use("/auth", cors());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port} `);
});
