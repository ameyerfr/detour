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
  address : String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  url : String,
  details : String
});

const Poi = mongoose.model("Poi", schema);

module.exports = Poi;
