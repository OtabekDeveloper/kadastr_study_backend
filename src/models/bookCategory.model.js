const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const BookCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

BookCategorySchema.plugin(mongoosePaginate);
BookCategorySchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("bookcategory", BookCategorySchema);
