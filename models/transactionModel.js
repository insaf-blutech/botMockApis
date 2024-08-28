const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["Bill Payment", "Fund Transfer", "Withdrawal", "Deposit"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  sourceAccount: {
    type: String,
    required: true,
  },
  destinationAccount: {
    type: String,
  },
  bill: {
    type: Schema.Types.ObjectId,
    ref: "Bill",
  },
  description: {
    type: String,
  },
  referenceId: {
    type: String,
    unique: true,
    required: true,
  },
  transactions: {
    type: [Object],
    required: false,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
