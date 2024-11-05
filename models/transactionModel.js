const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the transaction schema
// const transactionSchema = new Schema(
//   {
//     fromAccount: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Account",
//       required: true,
//     },
//     toAccount: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Account",
//       required: true,
//     },
//     mainCategory: {
//       type: String,
//       enum: ["Fund Transfer", "Bill Payment"], // Added Expense and Income
//       required: true,
//     },
//     subCategory: {
//       type: String,
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     billDetails: {
//       billerName: {
//         type: String,
//         required: function () {
//           return this.transactionType === "Bill Payment";
//         },
//       },
//       billerCategory: {
//         type: String, // e.g., Electricity, Water, Internet
//         required: function () {
//           return this.transactionType === "Bill Payment";
//         },
//       },
//       billerSubCategory: {
//         type: String, // e.g., Electricity, Water, Internet
//         required: function () {
//           return this.transactionType === "Bill Payment";
//         },
//       },
//       billId: {
//         type: Number, // e.g., Electricity, Water, Internet
//         required: function () {
//           return this.transactionType === "Bill Payment";
//         },
//       },
//     },
//     type: {
//       type: String,
//       enum: ["income", "expense"],
//       required: true,
//     },
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );
const transactionSchema = new Schema(
  {
    session_id: {
      type: Number,
      required: true,
    },
    account_holder_name: {
      type: String,
      required: true,
    },
    transactions: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
