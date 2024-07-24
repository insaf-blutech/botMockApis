const express = require("express");
const AccountController = require("../controllers/AccountController");

const router = express.Router();

router.get("/checkBalance", AccountController.checkBalance);
router.get("/checkRewardPoints", AccountController.checkRewardPoints);
router.get("/transactions", AccountController.transactions);

module.exports = router;
