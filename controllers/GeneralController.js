const branches = require("../data/branches.json");
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
}
module.exports = new GeneralController();
