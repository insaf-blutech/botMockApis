const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  routeUrl: {
    type: String,
    required: true,
  },
});

const UrlModel = mongoose.model("Url", urlSchema);

module.exports = UrlModel;
