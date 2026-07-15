const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    dressType: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    deliveryDate: {
      type: Date,
      default: null,
    },

    deliveredDate: {
      type: Date,
      default: null,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    advanceAmount: {
      type: Number,
      default: 0,
    },

    balanceAmount: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Delivered"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
