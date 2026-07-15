const Order = require("../models/Order");

const getOrderFilter = (id) =>
  id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: id }
    : { orderId: id };

// Create Order
const createOrder = async (req, res) => {
  try {
    console.log("===== Incoming Order =====");
    console.log(req.body);

    const order = await Order.create(req.body);

    console.log("Saved Successfully");

    res.status(201).json({
      success: true,
      data: order,
    });

  } catch (error) {

    console.log("========== ERROR ==========");
    console.log(error);
    console.log(error.message);
    console.log(error.errors);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne(getOrderFilter(req.params.id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      getOrderFilter(req.params.id),
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete(getOrderFilter(req.params.id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
