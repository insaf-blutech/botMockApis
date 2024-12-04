const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // Assuming the account collection is named 'Account'
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 16,
    maxlength: 16,
  },
  cardCategory: {
    type: String,
    default: "Gold",
    enum: ["Gold", "Silver", "Platinum"],
  },
  cardType: {
    type: String,
    default: "Credit",
    enum: ["Credit", "Debit"],
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{2}\/\d{2}$/.test(value); // Validates MM/YY format
      },
      message: "Expiry date must be in MM/YY format",
    },
  },
  cvv: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 3,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  limits: {
    dailyTransactionLimit: {
      type: Number,
      required: true,
    },
    monthlyTransactionLimit: {
      type: Number,
      required: true,
    },
  },
  features: {
    type: [String],
    enum: ["contactless", "international transactions", "cashback", "rewards"],
  },
});

module.exports = mongoose.model("Card", CardSchema);
