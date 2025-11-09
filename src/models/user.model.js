const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
    phone: { type: String },
    password: { type: String },
    role: { type: String }, // user
    photo: { type: String, default:null }, // default null
    province: { type: mongoose.Schema.Types.ObjectId, ref: "province" },
    region: { type: mongoose.Schema.Types.ObjectId, ref: "region" },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "group" },
    device: {
      type: Object,
      default: null
    }
  },
  { timestamps: true, versionKey: false }
);

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("user", UserSchema);
