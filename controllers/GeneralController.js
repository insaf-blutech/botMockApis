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
    const { city, itemType } = req.query;
    let filter = {};

    if (itemType) {
      filter.type = { $regex: new RegExp(itemType, "i") };
    }
    if (city) {
      filter.city = { $regex: new RegExp(city, "i") };
    }
    try {
      const accountNumber = Number(req.query?.accountNumber);
      const account = await AccountModel.findOne({ session_id: accountNumber });
      if (!account.cards) {
        throw new Error("Incorrect Account Number");
      }
      const discounts = await DiscountModel.find({
        ...filter,
        cardType: account.cards[0].cardType,
        cardCategory: account.cards[0].cardCategory,
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
