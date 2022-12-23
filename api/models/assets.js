//importing dependencies
const mongoose = require("mongoose");
const { ASSET_CATEGORY, ASSET_STATUS } = require("../../config/constants");

const assetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum:ASSET_CATEGORY
    },
    description: {
      type: String
    },
    serialNumber: {
      type: String,
      maxLength:[25,"please provide atmost 5"]
    },
    assignment: [
      {
        employee: {
          type: mongoose.Types.ObjectId,
          ref: "Employee",
        },
        assignedDate: {
          type: Date,
        },
        returnedDate: {
          type: Date,
        },
      },
    ],
    status: {
      type: String,
      enum: ASSET_STATUS,
      default: ASSET_STATUS[0],
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: "assets",
  }
);

module.exports = mongoose.model("Asset", assetSchema);
