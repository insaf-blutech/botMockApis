const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedBillSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    billName: {
      type: String,
      required: true,
    },
    bill: {
      type: Schema.Types.ObjectId,
      ref: "Bill",
      required: true,
    },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  }
);

const SavedBill = mongoose.model("SavedBill", savedBillSchema);

module.exports = SavedBill;
