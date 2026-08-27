import { getOrders } from "./orderService";

export const getReportData = async () => {
  try {
    const orders = await getOrders();

    const today = new Date()
      .toISOString()
      .split("T")[0];

    // =====================================================
    // ORDER COUNTS
    // =====================================================

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    const completedOrders = orders.filter(
      (order) =>
        order.status === "Completed" ||
        order.status === "Delivered"
    ).length;

    // =====================================================
    // TODAY'S ORDERS
    // =====================================================

    const todaysOrders = orders.filter(
      (order) => order.dueDate === today
    ).length;

    // =====================================================
    // TODAY'S DELIVERIES
    // =====================================================

    const todaysDeliveries = orders.filter(
      (order) =>
        order.deliveredDate === today &&
        order.status === "Delivered"
    ).length;

    // =====================================================
    // TOTAL REVENUE
    //
    // ALL ORDERS
    // =====================================================

    const totalRevenue = orders.reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || 0),
      0
    );

    // =====================================================
    // COMPLETED / DELIVERED ORDERS
    // =====================================================

    const completedDeliveredOrders = orders.filter(
      (order) =>
        order.status === "Completed" ||
        order.status === "Delivered"
    );

    // =====================================================
    // PAYMENT RECEIVED
    //
    // ONLY COMPLETED / DELIVERED ORDERS
    //
    // Uses the advance amount stored on the order.
    // =====================================================

    const paymentReceived =
      completedDeliveredOrders.reduce(
        (sum, order) =>
          sum + Number(order.advanceAmount || 0),
        0
      );

    // =====================================================
    // PENDING BALANCE
    // =====================================================

    const pendingBalance = Math.max(
      0,
      totalRevenue - paymentReceived
    );

    // =====================================================
    // RETURN REPORT
    // =====================================================

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      todaysOrders,
      todaysDeliveries,

      totalRevenue,
      paymentReceived,
      pendingBalance,
    };

  } catch (error) {

    console.error(
      "Error fetching report data:",
      error
    );

    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      todaysOrders: 0,
      todaysDeliveries: 0,

      totalRevenue: 0,
      paymentReceived: 0,
      pendingBalance: 0,
    };
  }
};


// =====================================================
// REPORT ORDER LISTS
// =====================================================

export const getOrdersByReport = async (type) => {

  try {

    const orders = await getOrders();

    const today = new Date()
      .toISOString()
      .split("T")[0];

    switch (type) {

      case "Total Orders":
        return orders;


      case "Pending Orders":
        return orders.filter(
          (order) =>
            order.status === "Pending"
        );


      case "Completed Orders":
        return orders.filter(
          (order) =>
            order.status === "Completed" ||
            order.status === "Delivered"
        );


      case "Today's Orders":
        return orders.filter(
          (order) =>
            order.dueDate === today
        );


      case "Today's Deliveries":
        return orders.filter(
          (order) =>
            order.deliveredDate === today &&
            order.status === "Delivered"
        );


      default:
        return [];
    }

  } catch (error) {

    console.error(
      "Error fetching orders by report:",
      error
    );

    return [];
  }
};