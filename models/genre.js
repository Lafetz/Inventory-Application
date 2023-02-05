const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const genreSchema = new Schema({
  name: { type: String, required: true },
});
genreSchema.virtual("id").get(function () {
  return this._id;
});
module.exports = mongoose.model("Genre", genreSchema);
