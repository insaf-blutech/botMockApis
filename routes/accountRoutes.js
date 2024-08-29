const express = require("express");
const AccountController = require("../controllers/AccountController");

const router = express.Router();

router.post("/addPayeeAccount", AccountController.AddPayeeAccount);
router.get("/checkBalance", AccountController.checkBalance);
router.get("/checkRewardPoints", AccountController.checkRewardPoints);
router.get("/transactions/number", AccountController.transactionsByNumber);
router.get("/transactions/date", AccountController.transactionsByDate);
router.get("/expenditure/summary", AccountController.expenditureSummary);
router.get(
  "/expenditure/summary/category",
  AccountController.expenditureSummaryByCategory
);

module.exports = router;
