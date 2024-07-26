const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    session_id: { type: Number, required: true },
    account_holder_name: { type: String, required: true },
    bankName: { type: String, required: true },
    balance: { type: Number, required: true },
    currency: { type: String, required: true, default: "Pkr" },
  },
  {
    timestamps: true,
  }
);
const AccountModel = mongoose.model("Account", AccountSchema);
module.exports = AccountModel;
