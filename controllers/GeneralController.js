const branches = require("../data/branches.json");
const AccountModel = require("../models/accountModel");
const CardModel = require("../models/CardModel");
const DiscountModel = require("../models/discountModel");
const FaqModel = require("../models/FaqsModel");
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
  async getCardStatus(req, res) {
    const { cardType, cardCategory } = req.query;
    const accountNumber = Number(req?.query?.accountNumber);
    try {
      if (!accountNumber || !cardCategory || !cardType) {
        throw new Error("Need all info about the card");
      }

      const result = await AccountModel.aggregate([
        // Step 1: Match the account based on session_id
        { $match: { session_id: accountNumber } },
        // Step 2: Lookup cards linked to the account
        {
          $lookup: {
            from: "cards", // Name of the Card collection
            localField: "_id", // Account _id
            foreignField: "accountId", // card.accountId
            as: "cards", // Output array field
          },
        },

        // Step 4: Match additional criteria for cardsd
        { $unwind: "$cards" },
        // Step 3: Unwind cards array to simplify querying
        {
          $match: {
            "cards.cardType": { $regex: new RegExp(cardType, "i") }, // Compare cardType
            "cards.cardCategory": { $regex: new RegExp(cardCategory, "i") }, // Compare cardCategory
          },
        },
        // Step 4: Project desired fields
        {
          $project: {
            // _id: 0, // Exclude _id from output
            accountNumber: "$session_id", // Rename session_id to accountNumber
            cardNumber: "$cards.cardNumber",
            cardStatus: "$cards.isActive", // Include card status
            cardType: "$cards.cardType",
            cardCategory: "$cards.cardCategory",
          },
        },
      ]);

      if (result.length == 0) {
        throw new Error("No Particular Card Found");
      }
      console.log("Card Status : ", result);
      res
        .status(200)
        .json({ message: "Card Status Fetched Successfully", data: result });
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
  async getFaqs(req, res) {
    try {
      const faqs = await FaqModel.find({});
      if (faqs) {
        res
          .status(200)
          .json({ message: "Faqs Data fetched Successfully", data: faqs });
      } else {
        res.status(404).json({ message: "No Faqs Data Found", data: null });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getNextOfKin(req, res) {
    try {
      const nextOfKin = {
        fullName: "Ayesha Khan",
        relationship: "Mother",
        dateOfBirth: "1965-05-15",
        gender: "Female",
        contactInfo: {
          phone: "+92-312-3456789",
          email: "ayesha.khan@example.com",
          address: {
            houseNumber: "12-A",
            street: "Gulberg III",
            city: "Lahore",
            province: "Punjab",
            postalCode: "54000",
            country: "Pakistan",
          },
        },
        identification: {
          idType: "CNIC",
          idNumber: "35201-1234567-8",
          issueDate: "2015-01-01",
          expiryDate: "2025-12-31",
        },
        emergencyContact: true,
        primaryBeneficiary: true,
      };

      res
        .status(200)
        .json({ message: "Next Of Kin fetched Successfully", data: nextOfKin });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
module.exports = new GeneralController();
