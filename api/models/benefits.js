//importing dependencies
const mongoose = require("mongoose");
const { BENEFITS_CATEGORY } = require("../../config/constants");

const benefitSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: BENEFITS_CATEGORY,
    },
    title: {
      type: String,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: "benefits",
  }
);

module.exports = mongoose.model("Benefit", benefitSchema);
