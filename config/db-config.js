const mongoose = require("mongoose");
const DB_URL =
  "mongodb+srv://abdulsamadpieces:Hafizhabib123@cluster0.xiihiah.mongodb.net/";
const dbName = "finbotMock";

const dbConnection = () => {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbName,
    })
    .then(() => console.log("Database Connection Successful"))
    .catch((err) =>
      console.error("Failed To Connect With Database,\nReason:", err.message)
    );
};

module.exports = dbConnection;
