const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    list: { type: Array, required: false },
  },
  {
    timestamps: true,
  }
);
const FaqModel = mongoose.model("Faq", FaqSchema);
module.exports = FaqModel;
