const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BranchSchema = new Schema(
  {
    branch_name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    hours: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);
const BranchModel = mongoose.model("Branch", BranchSchema);
module.exports = BranchModel;
