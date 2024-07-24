const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    session_id: { type: Number, required: true },
    account_holder_name: { type: String, required: true },
    transactions: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);
const TransactionModel = mongoose.model("Transaction", TransactionSchema);
module.exports = TransactionModel;
