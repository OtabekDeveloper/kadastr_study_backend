const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const GroupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    active: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

GroupSchema.plugin(mongoosePaginate);
GroupSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("group", GroupSchema);
