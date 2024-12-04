const express = require("express");
const GeneralController = require("../controllers/GeneralController");
const router = express.Router();

router.get("/branches/saturday", GeneralController.getSaturdayOpenedBranches);
router.get("/card/discounts", GeneralController.getCardDiscounts);
router.get("/card/cardStatus", GeneralController.getCardStatus);

router.post("/saveRouteUrl", GeneralController.saveRouteUrl);
router.get("/getRouteUrl", GeneralController.getRouteUrl);

router.get("/getFaqs", GeneralController.getFaqs);
router.get("/nextOfKin", GeneralController.getNextOfKin);

module.exports = router;
