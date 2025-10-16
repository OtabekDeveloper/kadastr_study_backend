const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ProvinceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

ProvinceSchema.plugin(mongoosePaginate);
ProvinceSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("province", ProvinceSchema);
