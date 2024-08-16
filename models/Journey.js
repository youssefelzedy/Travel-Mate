const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JourneySchema = new Schema(
    {
      location: {
        type: Object,
      },
      city:{
        type:String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      transport :{
        type:String
      }
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
    }
  );
  
const Journey = mongoose.model("Journey", JourneySchema);
module.exports = Journey