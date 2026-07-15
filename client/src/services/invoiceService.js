import { getOrders } from "./orderService";

export const getInvoice = async (orderId) => {
  const orders = await getOrders();

  return orders.find(
    (order) => order.orderId === orderId
  );
};
