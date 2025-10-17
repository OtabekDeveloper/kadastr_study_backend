const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const TestSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "subject" },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "lesson" },
    file: { type: String, default: null },
    options: [
      {
        answer: { type: String },
        file: { type: String },
        isCorrect: { type: Boolean, default: false }, // tog'ri javobligi
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

TestSchema.plugin(mongoosePaginate);
TestSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("test", TestSchema);
