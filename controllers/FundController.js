const accounts = require("../data/accounts.json");
class FundController {
  checkAccount(req, res) {
    const recieverAccount = Number(req.query.accountNumber);
    console.log("REQQQQQ", recieverAccount);
    const account = accounts.find((acc) => acc.session_id === recieverAccount);
    if (account) {
      res.status(200).json({ message: "Account Data Fetched", data: account });
    } else {
      res.status(404).json({ message: "Account Not Found" });
    }
  }
  validateSenderBalance(req, res) {
    try {
      const senderAccount = Number(req.query.accountNumber);
      const sendingAmount = Number(req.query.sendingAmount);
      console.log("REQQQQQ", senderAccount, sendingAmount);
      const account = accounts.find((acc) => acc.session_id === senderAccount);
      if (account) {
        if (account.balance < sendingAmount) {
          throw new Error("Amount is Insufficient");
        }
        res.status(200).json({ message: "Sufficient Balance", data: account });
      } else {
        res.status(404).json({ message: "Account Not Found" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message, data: null });
    }
  }
  verifyTransfer(req, res) {
    try {
      const otp = Number(req.body.otp);
      const senderAccount = Number(req.body.senderAccount);
      const recieverAccount = Number(req.body.recieverAccount);
      const sendingAmount = Number(req.body.sendingAmount);

      const sender = accounts.find((acc) => acc.session_id === senderAccount);
      const reciever = accounts.find(
        (acc) => acc.session_id === recieverAccount
      );
      if (sender && reciever) {
        if (otp === 1234) {
          sender.balance = sender.balance - sendingAmount;
          reciever.balance = reciever.balance + sendingAmount;
          res.status(200).json({
            message: "Amount Transferred Successfully",
            data: { sender, reciever },
          });
        } else {
          throw new Error("Invalid OTP");
        }
      } else {
        res.status(404).json({ message: "Account Not Found" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message, data: null });
    }
  }
}
module.exports = new FundController();
