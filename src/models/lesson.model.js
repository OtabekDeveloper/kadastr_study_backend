const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "subject" },
    step: { type: Number },
    video: { type: String },
    docs: [
      {
        title: { type: String },
        path: { type: String },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

LessonSchema.plugin(mongoosePaginate);
LessonSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("lesson", LessonSchema);
