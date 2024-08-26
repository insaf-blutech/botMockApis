const express = require("express");
const BillController = require("../controllers/BillController");

const router = express.Router();

router.post("/payBill", BillController.PayBill);

module.exports = router;
