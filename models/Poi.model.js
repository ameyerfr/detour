const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {type:String, required:true},
  description: String,
  image: String,
  coordinates: {
    lat : Number,
    lng : Number
  },
  location: {
    type: { type: String },
    coordinates: []
  },
  address : String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  url : String,
  details : String
});

schema.index({ location: "2dsphere" });

const Poi = mongoose.model("Poi", schema);

module.exports = Poi;
