const branches = require("../data/branches.json");
const AccountModel = require("../models/accountModel");
const DiscountModel = require("../models/discountModel");
const UrlModel = require("../models/urlModel");
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
        throw new Error("No Discounts Applicable for this Account");
      }
      const cardTypes = account?.cards.map((cr) => cr.cardType);
      const cardCategories = account?.cards.map((cr) => cr.cardCategory);
      const discounts = await DiscountModel.find({
        ...filter,
        cardType: { $in: cardTypes },
        cardCategory: { $in: cardCategories },
        // cardType: account.cards[0].cardType,
        // cardCategory: account.cards[0].cardCategory,
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
  async saveRouteUrl(req, res) {
    try {
      const { routeUrl } = req.body;

      if (!routeUrl) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Find the existing URL document (assuming there's only one)
      let urlDoc = await UrlModel.findOne();

      if (urlDoc) {
        // If a document exists, update it
        urlDoc.routeUrl = routeUrl;
        await urlDoc.save();
      } else {
        // If no document exists, create a new one
        urlDoc = new UrlModel({ routeUrl });
        await urlDoc.save();
      }

      res
        .status(200)
        .json({ message: "URL saved successfully", routeUrl: urlDoc.routeUrl });
    } catch (error) {
      console.error("Error saving URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getRouteUrl(req, res) {
    try {
      const routeUrl = await UrlModel.findOne({});
      if (routeUrl) {
        res
          .status(200)
          .json({ message: "Route Url fetched Successfully", data: routeUrl });
      } else {
        res.status(404).json({ message: "No Route Url Found", data: null });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
module.exports = new GeneralController();
