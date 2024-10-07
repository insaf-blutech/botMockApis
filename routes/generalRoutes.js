const express = require("express");
const GeneralController = require("../controllers/GeneralController");
const router = express.Router();

router.get("/branches/saturday", GeneralController.getSaturdayOpenedBranches);
router.get("/card/discounts", GeneralController.getCardDiscounts);

router.post("/saveRouteUrl", GeneralController.saveRouteUrl);
router.get("/getRouteUrl", GeneralController.getRouteUrl);

module.exports = router;
