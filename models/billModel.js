const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Electricity",
      "Gas",
      "Water",
      "Telecommunications",
      "Waste Management",
      "Property Tax",
    ],
  },
  subCategory: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bill = mongoose.model("Bill", BillSchema);
module.exports = Bill;
