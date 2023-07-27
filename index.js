const express = require("express");
const cors = require("cors");
const app = express();
const conn = require("./db/conn");
const routes = require("./routes/router");

app.use(cors());
app.use(express.json());
conn();
app.use("/api", routes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port} `);
});
