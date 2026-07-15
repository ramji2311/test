const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    bust: Number,
    waist: Number,
    hip: Number,
    shoulder: Number,
    sleeve: Number,
    height: Number,
    remarks: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Measurement", measurementSchema);