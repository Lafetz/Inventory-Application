const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const publisherSchema = new Schema({
  name: { type: String, requierd: true },
});
publisherSchema.virtual("id").get(function () {
  return this._id;
});
module.exports = mongoose.model("Publisher", publisherSchema);
