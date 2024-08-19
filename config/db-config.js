const mongoose = require("mongoose");
const express = require("express");
const app = express();
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
  // mongoose
  //   .connect(DB_URL, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     dbName: dbName,
  //   })
  //   .then(() => {
  //     console.log("Connected to MongoDB");
  //     // Start the server after the database connection is established
  //     app.listen(8000, () => {
  //       console.log("Server is live at 8000.....");
  //     });
  //   })
  //   .catch((err) => {
  //     console.error("Failed to connect to Database", err);
  //     process.exit(1); // Exit the process with an error code
  //   });
};

module.exports = dbConnection;
