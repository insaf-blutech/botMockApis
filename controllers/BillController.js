const accounts = require("../data/accounts.json");
const AccountModel = require("../models/accountModel");
const BillModel = require("../models/billModel");
const SavedBill = require("../models/savedBillModel");
class BillController {
  async PayBill(req, res) {
    const { category, subCategory, accountNumber, billId, billName } = req.body;
    try {
      if (!category || !subCategory || !accountNumber || !billName) {
        throw new Error("All fields Required!!!");
      }

      console.log("REQQQQQ", accountNumber);
      const billFound = await SavedBill.findOne({
        accountNumber: accountNumber,
        category: category,
        billName: { $regex: new RegExp(billName, "i") },
      });

      // If account found then pay the bill from user account
      // else response with No Bill Found
      if (!billFound) {
        return res.status(404).json({
          message: "Bill Not Found in Saved Bills. Add a Bill",
          type: "BillNotSaved",
        });
      }
      const currMonth = new Date().getMonth();
      const currYear = new Date().getFullYear();
      const bills = await BillModel.find({
        accountNumber: billFound.billId,
        // month: currMonth + 1,
        year: { $lte: currYear },
        isPaid: false,
      });
      // Doing Transaction
      // For time being lets pay current month bill
      if (bills && bills.length > 0) {
        let totalAmount;
        bills.map((bill) => {
          let amountWithPenalty = bill.amount;

          if (Date.now() > bill.dueDate) {
            amountWithPenalty += bill.amount * 10;
          }
          totalAmount += amountWithPenalty;
        });

        const session = await AccountModel.startSession();
        session.startTransaction();
        const user = await AccountModel.findOne({
          session_id: accountNumber,
        }).session(session);
        if (user.balance > totalAmount) {
          user.balance -= totalAmount;
          user.balance = parseFloat(user.balance).toFixed(2);
          await user.save({ session });

          for (let bill of bills) {
            bill.isPaid = true;
            await bill.save({ session });
          }
          await session.commitTransaction();
          session.endSession();
          res.status(200).json({
            message: "Bill Payed Successfully",
            totalPaid: totalAmount,
            data: bills,
          });
        } else {
          return res.status(400).json({
            message: "Insufficient Amount to Pay the Bills",
            type: "InsufficientBalance",
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Bill Already Paid", type: "BillCleared" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  async AddBill(req, res) {
    const { category, subCategory, billName, billId, accountNumber } = req.body;
    try {
      if (!billName || !billId || !accountNumber || !category || !subCategory) {
        throw new Error("All fields Required!!!");
      }

      console.log("REQQQQQ", accountNumber);
      const billFound = await SavedBill.findOne({
        billName: { $regex: new RegExp(billName, "i") },
        // billName: billName,
        accountNumber: accountNumber,
        billId: billId,
      });
      if (billFound) {
        throw new Error("Bill Already Added");
      }
      const billAdded = await SavedBill.create({ ...req.body });
      if (billAdded) {
        res.status(200).json({ message: "New Bill Added", data: billAdded });
      } else {
        throw new Error("Error Adding Bill");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
module.exports = new BillController();
