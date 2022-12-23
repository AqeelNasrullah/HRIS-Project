//importing dependencies
const mongoose = require("mongoose");
const { TIMEOFF_CATEGORY, TIMEOFF_STATUS } = require("../../config/constants");

const timeoffSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: [true, "Please provide start time"],
    },
    endTime: {
      type: Date,
      required: [true, "Please provide end time"],
    },
    category: {
      type: String,
      enum: TIMEOFF_CATEGORY,
      required: [true, "Please provide category of timeoff"],
    },
    hour: {
      type: Number,
      required: [true, "Please provide hours for timeoff"],
    },
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
    note: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: TIMEOFF_STATUS,
      default: TIMEOFF_STATUS[0],
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: "timeoffs",
  }
);

module.exports = mongoose.model("Timeoff", timeoffSchema);
