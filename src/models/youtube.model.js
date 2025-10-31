const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const YoutubeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    date:{type: String, default:null},
    active:{type: Boolean, default:false}
  },
  { timestamps: true, versionKey: false }
);

YoutubeSchema.plugin(mongoosePaginate);
YoutubeSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("youtube", YoutubeSchema);
