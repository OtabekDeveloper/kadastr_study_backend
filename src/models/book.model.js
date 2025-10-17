const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    desc: { type: String },
    file: { type: String }, //  Kitobning PDF fayli
    cover: { type: String }, //  Kitob muqova rasmi (jpg, png va h.k.)
    bookcategory: { type: mongoose.Schema.Types.ObjectId, ref: "bookcategory" },
  },
  { timestamps: true, versionKey: false }
);

BookSchema.plugin(mongoosePaginate);
BookSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("book", BookSchema);
