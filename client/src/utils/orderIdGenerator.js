import { getOrders } from "../services/orderService";
import { getSettings } from "../services/settingsService";

export const generateOrderId = async () => {
  const settings = getSettings();

  if (settings.nextOrderNumber && !isNaN(Number(settings.nextOrderNumber))) {
    return String(settings.nextOrderNumber);
  }

  const orders = await getOrders();
  const FIRST_ORDER_NUMBER = 19000;

  const lastNumber = orders.reduce((max, order) => {
    const cleanIdStr = order.orderId ? String(order.orderId).replace(/\D/g, "") : "";
    const number = Number(cleanIdStr);

    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, FIRST_ORDER_NUMBER - 1);

  const nextNumber = lastNumber + 1;

  return String(nextNumber);
};
