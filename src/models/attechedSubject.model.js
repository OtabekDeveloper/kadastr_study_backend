const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const AttachedSubjectSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "subject" },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "lesson" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    isPassed: { type: Boolean, default: false },
    lessonStep: { type: Number },
    correctCount: { type: Number, default: 0 },
    result: [
      {
        date: { type: String },
        total: { type: Number, default: 0 },
        correctCount: { type: Number, default: 0 },
        inCorrectCount: { type: Number, default: 0 },
        present: { type: Number, default: 0 },
        time: { type: String },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

AttachedSubjectSchema.plugin(mongoosePaginate);
AttachedSubjectSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("attachedsubject", AttachedSubjectSchema);
