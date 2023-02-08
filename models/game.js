const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const gameSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher", required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});
gameSchema.virtual("id").get(function () {
  return this._id;
});
module.exports = mongoose.model("Game", gameSchema);
