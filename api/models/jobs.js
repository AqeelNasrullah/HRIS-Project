//importing dependencies
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: [true, "Please enter department name"],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Please enter job title"],
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: "jobs",
  }
);

module.exports = mongoose.model("Job", jobSchema);
