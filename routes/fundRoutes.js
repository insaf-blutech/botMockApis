const express = require("express");
const FundController = require("../controllers/FundController");

const router = express.Router();

router.post("/transfer/checkAccount", FundController.checkAccount);
router.post(
  "/transfer/checkSenderBalance",
  FundController.validateSenderBalance
);
router.post("/transfer/verifyTransfer", FundController.verifyTransfer);
module.exports = router;
