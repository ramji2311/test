import { getOrders } from "./orderService";

export const getDashboardStats = async () => {

  const orders = await getOrders();

  const today = new Date().toISOString().split("T")[0];

  const todaysOrders = orders.filter(
    order => order.bookingDate === today
  ).length;

  const dueToday = orders.filter(
    order =>
      order.dueDate === today &&
      order.status !== "Delivered"
  ).length;

  const pendingOrders = orders.filter(
    order => order.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    order =>
      order.status === "Completed" ||
      order.status === "Delivered"
  ).length;

  const recentOrders = [...orders]
    .reverse()
    .slice(0, 5);

  const upcomingDueOrders = orders
    .filter(order => order.status !== "Delivered")
    .sort(
      (a, b) =>
        new Date(a.dueDate) - new Date(b.dueDate)
    )
    .slice(0, 5);

  return {
    todaysOrders,
    dueToday,
    pendingOrders,
    completedOrders,
    recentOrders,
    upcomingDueOrders,
  };

};