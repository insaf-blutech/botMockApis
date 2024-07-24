const express = require("express");
const AccountController = require("../controllers/AccountController");

const router = express.Router();

router.get("/checkBalance", AccountController.checkBalance);
router.get("/checkRewardPoints", AccountController.checkRewardPoints);
router.get("/transactions/number", AccountController.transactionsByNumber);
router.get("/transactions/date", AccountController.transactionsByDate);

module.exports = router;
