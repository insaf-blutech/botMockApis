const express = require("express");
const GeneralController = require("../controllers/GeneralController");
const router = express.Router();

router.get("/branches/saturday", GeneralController.getSaturdayOpenedBranches);

module.exports = router;
