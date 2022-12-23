//importing dependencies
const mongoose = require("mongoose");
const { ONBOARDING_CATEGORY } = require("../../config/constants");

const onboardingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ONBOARDING_CATEGORY,
      required: [true, "Please provide category of onboarding task"],
    },
    taskName: {
      type: String,
      required: [true, "Please provide name of onboarding task"],
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
    collection: "onboardings",
  }
);

module.exports = mongoose.model("Onboarding", onboardingSchema);
