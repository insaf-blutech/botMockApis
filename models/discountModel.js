const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiscountSchema = new Schema(
  {
    name: { type: String, required: true },
    discount: { type: String, required: true },
    maxDiscount: { type: Number, required: true },
    type: { type: String, required: true },
    cardType: { type: String, required: true },
    cardCategory: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const DiscountModel = mongoose.model("Discount", DiscountSchema);
module.exports = DiscountModel;
