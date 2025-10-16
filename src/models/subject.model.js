const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const SubjectSchema = new mongoose.Schema(
  {
    title: { type: String },
    desc: { type: String },
    photo: { type: String },
    active: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

SubjectSchema.plugin(mongoosePaginate);
SubjectSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("subject", SubjectSchema);
