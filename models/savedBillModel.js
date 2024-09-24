const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedBillSchema = new Schema(
  {
    accountNumber: {
      type: String,
      required: true,
    },
    billName: {
      type: String,
      required: true,
    },
    billId: {
      type: String,
      ref: "Bill",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  }
);

const SavedBill = mongoose.model("SavedBill", savedBillSchema);

module.exports = SavedBill;
