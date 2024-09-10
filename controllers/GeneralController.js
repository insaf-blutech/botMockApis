const branches = require("../data/branches.json");
const AccountModel = require("../models/accountModel");
const DiscountModel = require("../models/discountModel");
class GeneralController {
  getSaturdayOpenedBranches(req, res) {
    try {
      console.log("BRANCHHHHHH : ");
      res
        .status(200)
        .json({ message: "Branches Fetched Successfully", data: branches });
    } catch (err) {
      res.status(400).json({ message: err.message, data: null });
    }
  }
  async getCardDiscounts(req, res) {
    const { city, type } = req.query;
    let filter = {};

    if (type) {
      filter.type = type;
    }
    if (city) {
      filter.city = type;
    }
    try {
      const accountNumber = Number(req.query?.accountNumber);
      const account = await AccountModel.findOne({ session_id: accountNumber });
      if (!account.cards) {
        throw new Error("Incorrect Account Number");
      }
      const discounts = await DiscountModel.find({
        // city,
        ...filter,
        cardType: account.cards[0].cardType,
        cardCategory: account.cards[0].cardCategory,
        // type,
      });
      console.log("CArdssssssss : ", city);
      if (discounts) {
        res
          .status(200)
          .json({ message: "Discounts Fetched Successfully", data: discounts });
      } else {
        res.status(404).json({ message: "No Discounts Found", data: [] });
      }
    } catch (err) {
      res.status(400).json({ message: err.message, data: null });
    }
  }
}
module.exports = new GeneralController();
