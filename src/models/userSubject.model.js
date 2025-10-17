const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const UserSubjectSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "subject" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    date: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    complateCount: { type: Number, default: 0 }, // default:0

  },
  { timestamps: true, versionKey: false }
);

UserSubjectSchema.plugin(mongoosePaginate);
UserSubjectSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("usersubject", UserSubjectSchema);
