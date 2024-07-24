const accounts = require("../data/accounts.json");
const transactions = require("../data/transactions.json");

class AccountController {
  checkBalance(req, res) {
    const accountNumber = Number(req.query.accountNumber);
    console.log("REQQQQQ", accountNumber);
    const account = accounts.find((acc) => acc.session_id === accountNumber);
    if (account) {
      res.status(200).json({ message: "Account Data Fetched", data: account });
    } else {
      res.status(404).json({ message: "Account Not Found" });
    }
  }
  checkRewardPoints(req, res) {
    const accountNumber = Number(req.query.accountNumber);
    console.log("REQQQQQ", accountNumber);
    const account = accounts.find((acc) => acc.session_id === accountNumber);
    if (account) {
      account.balance = account.balance - 50000;
      res.status(200).json({ message: "Account Data Fetched", data: account });
    } else {
      res.status(404).json({ message: "Account Not Found" });
    }
  }
  transactions(req, res) {
    const accountNumber = Number(req.query.accountNumber);
    const numOfTransactions = Number(req.query.numOfTransactions) || 5;
    const { from, to } = req.query;
    console.log("REQQQQQ", req.query);
    const account = transactions.find(
      (trc) => trc.session_id === accountNumber
    );
    if (account) {
      let filteredTransactions = account.transactions;

      if (from || to) {
        filteredTransactions = filteredTransactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          const start = from ? new Date(from) : new Date("0000-01-01");
          const end = to ? new Date(to) : new Date();

          return transactionDate >= start && transactionDate <= end;
        });
      } else {
      }
      const sortedTransactions = filteredTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      //   const sortedTransactions = filteredTransactions.transactions.sort(
      //     (a, b) => new Date(b.date) - new Date(a.date)
      //   );

      const lastTransactions = sortedTransactions.slice(0, numOfTransactions);

      res
        .status(200)
        .json({ message: "Transactions Data Fetched", data: lastTransactions });
    } else {
      res.status(404).json({ message: "Transactions Not Found" });
    }
  }
}
module.exports = new AccountController();
