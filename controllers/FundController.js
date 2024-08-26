const accounts = require("../data/accounts.json");
const AccountModel = require("../models/accountModel");
class FundController {
  async checkAccount(req, res) {
    const recieverName = req.query.accountName;
    console.log("REQQQQQ", recieverName);
    const account = await AccountModel.find({
      account_holder_name: { $regex: new RegExp(`${recieverName}`, "i") },
    });
    if (account) {
      res.status(200).json({ message: "Account Data Fetched", data: account });
    } else {
      res.status(404).json({ message: "Account Not Found" });
    }
  }
  async validateSenderBalance(req, res) {
    try {
      const senderAccount = Number(req.query.accountNumber);
      const sendingAmount = Number(req.query.sendingAmount);
      console.log("REQQQQQ", senderAccount, sendingAmount);
      const account = await AccountModel.findOne({ session_id: senderAccount });
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
  async verifyTransfer(req, res) {
    const otp = Number(req.body.otp);
    const senderAccount = Number(req.body.senderAccount);
    const recieverAccount = Number(req.body.recieverAccount);
    const sendingAmount = Number(req.body.sendingAmount);

    const session = await AccountModel.startSession();
    session.startTransaction();
    try {
      const sender = await AccountModel.findOne({
        session_id: senderAccount,
      }).session(session);
      const receiver = await AccountModel.findOne({
        session_id: recieverAccount,
      }).session(session);

      if (sender && receiver) {
        if (otp === 1234) {
          sender.balance -= sendingAmount;
          receiver.balance += sendingAmount;
          console.log(sender, "\n", receiver);
          sender.balance = parseFloat(sender.balance).toFixed(2);
          receiver.balance = parseFloat(receiver.balance).toFixed(2);

          await sender.save({ session });
          await receiver.save({ session });

          await session.commitTransaction();
          session.endSession();
          res.status(200).json({
            message: "Amount Transferred Successfully",
            data: { sender, receiver },
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
