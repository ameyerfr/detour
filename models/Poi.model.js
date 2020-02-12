const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {type:String, required:true},
  description: String,
  image: String,
  category: {
    type: String,
    enum: ["Friends", "Museums", "resto_michelin", "resto", "resto_etoile"],
    required: true
  },
  coordinates: {
    lat : Number,
    lng : Number
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address : String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  url : String,
  details : String,
  place_id: String,
});

schema.index({ location: "2dsphere" });

const Poi = mongoose.model("Poi", schema);

module.exports = Poi;
