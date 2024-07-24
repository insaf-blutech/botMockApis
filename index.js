const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const cors = require("cors");

const balanceRoutes = require("./routes/balanceRoutes");
const accountRoutes = require("./routes/accountRoutes");
const generalRoutes = require("./routes/generalRoutes");
const fundRoutes = require("./routes/fundRoutes");
const dbConnection = require("./config/db-config");

app.use(express.json());
app.use(cors());

dbConnection();

app.get("/", (req, res) => {
  console.log("GET REQUEST : ", req.body);
  res.send("<h1>Hello</h1>");
});

app.use("/api/general", generalRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/fund", fundRoutes);

app.listen(8000, () => {
  console.log("Server is live at 8000.....");
});
