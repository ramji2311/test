const mongoose = require("mongoose");

const stitchingRateSchema = new mongoose.Schema(
  {
    dressName: {
      type: String,
      required: true,
      trim: true,
    },

    rate: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

const tailorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    stitchingRates: {
      type: [stitchingRateSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tailor", tailorSchema);