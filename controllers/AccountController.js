const accounts = require("../data/accounts.json");
const transactions = require("../data/transactions.json");
const AccountModel = require("../models/accountModel");
const BranchModel = require("../models/branchModel");
const TransactionModel = require("../models/transactionModel");

class AccountController {
  async AddPayeeAccount(req, res) {
    const { session_id, account_holder_name, bankName, payeeName } = req.body;
    try {
      if (!session_id || !account_holder_name || !bankName || !payeeName) {
        throw new Error("All fields Required!!!");
      }
      const accountNumber = Number(req.query.accountNumber);
      console.log("REQQQQQ", accountNumber);
      const accountFound = await AccountModel.findOne({
        session_id: session_id,
      });
      if (accountFound) {
        throw new Error("Payee Already Added");
      }
      const account = await AccountModel.create({ ...req.body });
      if (account) {
        res.status(200).json({ message: "New Payee Added", data: account });
      } else {
        throw new Error("Error Adding Payee");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
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

    const account = await TransactionModel.findOne({
      session_id: accountNumber,
    });
    if (account) {
      let filteredTransactions = account.transactions;

      console.log("REQQQQQ", filteredTransactions, "\n", account);
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
    let expenses = [];
    let earnings = [];

    if (account) {
      account.transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const amount = Number(transaction.amount);

        if (transactionDate >= fromDate && transactionDate <= toDate) {
          if (transaction.type == "expense") {
            expenses.push(transaction);
          } else {
            earnings.push(transaction);
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
  async expenditureSummaryByCategory(req, res) {
    const now = new Date();
    const fr = req.query.from ? new Date(req.query.from) : "";
    const to = req.query.to ? new Date(req.query.to) : "";
    const { category } = req.query;
    console.log("QQQQQQQQQQ : ", req.query.category);

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
    let expenses = [];
    let earnings = [];
    const regex = new RegExp(category, "i");

    const account = await TransactionModel.aggregate([
      {
        $match: {
          session_id: accountNumber,
        },
      },
      {
        $project: {
          _id: 1, // Include `_id` field
          session_id: 1, // Include `session_id` field
          account_holder_name: 1, // Include `account_holder_name` field
          id: 1, // Include `id` field
          transactions: {
            $filter: {
              input: "$transactions",
              as: "transaction",
              cond: {
                $or: [
                  {
                    $regexMatch: {
                      input: "$$transaction.mainCategory",
                      regex: regex,
                    },
                  },
                  {
                    $regexMatch: {
                      input: "$$transaction.subCategory",
                      regex: regex,
                    },
                  },
                  {
                    $regexMatch: {
                      input: "$$transaction.description",
                      regex: regex,
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    if (account) {
      account[0].transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const amount = Number(transaction.amount);

        if (transactionDate >= fromDate && transactionDate <= toDate) {
          if (transaction.type == "expense") {
            expenses.push(transaction);
          } else {
            earnings.push(transaction);
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
