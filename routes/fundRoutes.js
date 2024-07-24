const express = require("express");
const FundController = require("../controllers/FundController");

const router = express.Router();

router.get("/transfer/checkAccount", FundController.checkAccount);
router.get(
  "/transfer/checkSenderBalance",
  FundController.validateSenderBalance
);
router.post("/transfer/verifyTransfer", FundController.verifyTransfer);
module.exports = router;
