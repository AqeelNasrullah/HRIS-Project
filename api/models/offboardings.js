//importing dependencies
const mongoose = require("mongoose");

//importing constants
const { OFFBOARDING_CATEGORY } = require("../../config/constants");

const offboardingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: OFFBOARDING_CATEGORY,
      required: [true, "Please provide category of offboarding task"],
    },
    taskName: {
      type: String,
      required: [true, "Please provide name of offboarding task"],
      trim: true,
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
    due: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: "offboardings",
  }
);

module.exports = mongoose.model("Offboarding", offboardingSchema);
