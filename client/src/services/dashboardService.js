
import { getOrders } from "./orderService";

export const getDashboardStats = async () => {
  const orders = await getOrders();

  const today = new Date().toISOString().split("T")[0];

  // TOTAL ORDERS
  const totalOrders = orders.length;

  // TODAY'S ORDERS
  const todaysOrders = orders.filter(
    (order) => order.bookingDate === today
  ).length;

  // DUE TODAY
  const dueToday = orders.filter(
    (order) =>
      order.dueDate === today &&
      order.status !== "Delivered"
  ).length;

  // PENDING ORDERS
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  // COMPLETED / DELIVERED ORDERS
  const completedOrders = orders.filter(
    (order) =>
      order.status === "Completed" ||
      order.status === "Delivered"
  ).length;

  // COMPLETED / DELIVERED ORDERS ONLY
  const completedDeliveredOrders = orders.filter(
    (order) =>
      order.status === "Completed" ||
      order.status === "Delivered"
  );

  // TOTAL REVENUE
  const totalRevenue = completedDeliveredOrders.reduce(
    (total, order) =>
      total + (Number(order.totalAmount) || 0),
    0
  );

  // PAYMENT RECEIVED
  const paymentReceived = completedDeliveredOrders.reduce(
    (total, order) =>
      total + (Number(order.advanceAmount) || 0),
    0
  );

  // PENDING BALANCE
  const pendingBalance = Math.max(
    0,
    totalRevenue - paymentReceived
  );

  // RECENT ORDERS
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5);

  // UPCOMING DUE ORDERS
  const upcomingDueOrders = [...orders]
    .filter(
      (order) =>
        order.status !== "Delivered" &&
        order.dueDate >= today
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate) - new Date(b.dueDate)
    )
    .slice(0, 5);

  return {
    totalOrders,
    todaysOrders,
    dueToday,
    pendingOrders,
    completedOrders,
    totalRevenue,
    paymentReceived,
    pendingBalance,
    recentOrders,
    upcomingDueOrders,
  };
};
