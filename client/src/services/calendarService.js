import { getOrders } from "./orderService";

export const getDeliverySchedule = async () => {
  const orders = await getOrders();

  const today = new Date().toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  return {
    today: orders.filter(
      (order) => order.deliveryDate === today
    ),

    tomorrow: orders.filter(
      (order) => order.deliveryDate === tomorrowDate
    ),

    upcoming: orders.filter(
      (order) =>
        order.deliveryDate > tomorrowDate
    ),
  };
};
