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
  async expenditureSummary(req, res) {
    const now = new Date();
    const fr = req.query.from ? new Date(req.query.from) : "";
    const to = req.query.to ? new Date(req.query.to) : "";

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Determine the date range
    const fromDate = fr || startOfMonth;
    const toDate = to || endOfMonth;

    const duration = `${fromDate.toLocaleDateString()} to ${toDate.toLocaleDateString()}`;
    console.log("REQQQQQ", fromDate, toDate, "\n", duration);

    const accountNumber = Number(req.query.accountNumber);
    if (isNaN(accountNumber)) {
      return res.status(400).json({ message: "Invalid account number" });
    }

    const account = await TransactionModel.findOne({
      session_id: accountNumber,
    });
    let expenses = {};
    let earnings = {};

    if (account) {
      account.transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const amount = Number(transaction.amount);

        if (transactionDate >= fromDate && transactionDate <= toDate) {
          if (amount < 0) {
            if (!expenses[transaction.description]) {
              expenses[transaction.description] = 0;
            }
            expenses[transaction.description] += amount;
          } else if (amount > 0) {
            if (!earnings[transaction.description]) {
              earnings[transaction.description] = 0;
            }
            earnings[transaction.description] += amount;
          }
        }
      });

      res.status(200).json({
        message: "Expenditure Summary",
        data: { duration, expenses, earnings },
      });
    } else {
      res.status(404).json({ message: "Expenditure Summary Not Found" });
    }
  }
}
module.exports = new AccountController();
