const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JourneySchema = new Schema(
  {
    location: {
      type: Object,
      required: [
        true,
        { english: "Please add your location", arabic: "يرجى إضافة موقعك" },
      ],
    },
    destination: {
      type: Object,
      required: [
        true,
        {
          english: "Please add a destination",
          arabic: "يرجى إضافة الوجه الخاصة بك",
        },
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    transport: {
      type: String,
      required: [
        true,
        { english: "Please add a transport", arabic: "يرجى إضافة وسيلة نقل" },
      ],
      enum: {
        values: ["microbus", "taxi"],
        message: {
          english: "Please add a valid transport",
          arabic: "يرجى إضافة وسيلة نقل صالحة",
        },
      },
    },
    date: {
      type: Date,
      required: [
        true,
        { english: "Please add a date", arabic: "يرجى إضافة تاريخ" },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Journey = mongoose.model("Journey", JourneySchema);
module.exports = Journey;
