const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const SubjectTestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // ObjectId
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "subject" },
    startDate: { type: String },
    endDate: { type: String },
    questions: [
    ], // 30 ta fanda mavjud hamma darslardan aralashtirib olinadi
    correctCount: { type: Number, default: 0 },
    testType: { type: Number, default: 1 },  // 1=> yonalish boshida ishlangan test, 2=> darslarni tugatgandagi test
    isPassed: { type: Bollean, default: false }, // true o'tgan, false o'tolmagan  56% dan kam bolsa o'tmagan hisoblanadi
  },
  { versionKey: false, timestamps: true }
);

SubjectTestSchema.plugin(mongoosePaginate);
SubjectTestSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("subjecttest", SubjectTestSchema);
