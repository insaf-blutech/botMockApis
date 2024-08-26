const accounts = require("../data/accounts.json");
class BillController {
  async PayBill(req, res) {
    const { billName, amount } = req.body;
  }
}
module.exports = new BillController();
