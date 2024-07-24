const accounts = require("../data/accounts.json");
const transactions = require("../data/transactions.json");
const AccountModel = require("../models/accountModel");
const BranchModel = require("../models/branchModel");
const TransactionModel = require("../models/transactionModel");

class AccountController {
  async checkBalance(req, res) {
    const accountNumber = Number(req.query.accountNumber);
    console.log("REQQQQQ", accountNumber);
    const account = await AccountModel.findOne({ session_id: accountNumber });
    if (account) {
      res.status(200).json({ message: "Account Data Fetched", data: account });
    } else {
      res.status(404).json({ message: "Account Not Found" });
    }
  }
  async checkRewardPoints(req, res) {
    const accountNumber = Number(req.query.accountNumber);
    const account = await AccountModel.findOne({ session_id: accountNumber });
    if (account) {
      const accObject = account.toObject();
      accObject.rewardPoints = parseFloat((accObject.balance * 0.1).toFixed(2));
      delete accObject.balance;

      console.log("REQQQQQ", account);
      res
        .status(200)
        .json({ message: "Rewards Data Fetched", data: accObject });
    } else {
      res.status(404).json({ message: "Account Not Found" });
    }
  }
  async transactionsByNumber(req, res) {
    const accountNumber = Number(req.query.accountNumber);
    const numOfTransactions = Number(req.query.numOfTransactions) || 5;

    console.log("REQQQQQ", req.query);
    const account = await TransactionModel.findOne({
      session_id: accountNumber,
    });
    if (account) {
      let filteredTransactions = account.transactions;

      const sortedTransactions = filteredTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const lastTransactions = sortedTransactions.slice(0, numOfTransactions);

      res
        .status(200)
        .json({ message: "Transactions Data Fetched", data: lastTransactions });
    } else {
      res.status(404).json({ message: "Transactions Not Found" });
    }
  }
  async transactionsByDate(req, res) {
    const accountNumber = Number(req.query.accountNumber);
    const { from, to } = req.query;
    console.log("REQQQQQ", req.query);
    const account = await TransactionModel.findOne({
      session_id: accountNumber,
    });
    if (account) {
      let filteredTransactions = account.transactions;

      if (from || to) {
        filteredTransactions = filteredTransactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          const start = from ? new Date(from) : new Date();
          const end = to ? new Date(to) : new Date();

          return transactionDate >= start && transactionDate <= end;
        });
      }
      const sortedTransactions = filteredTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      res.status(200).json({
        message: "Transactions Data Fetched",
        data: sortedTransactions,
      });
    } else {
      res.status(404).json({ message: "Transactions Not Found" });
    }
  }
}
module.exports = new AccountController();
