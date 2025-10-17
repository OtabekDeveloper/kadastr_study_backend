const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    media: { type: [String], default: [] },
    active: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    date: { type: String },
  },
  { timestamps: true, versionKey: false }
);

NewsSchema.plugin(mongoosePaginate);
NewsSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("news", NewsSchema);
