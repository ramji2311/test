import { getOrders } from "../services/orderService";

const DAILY_CAPACITY = 15;
const ACTIVE_STATUSES = ["Pending", "In Progress"];

export const getCapacityStatus = async (dueDate) => {

  if (!dueDate) {
    return {
      maximum: DAILY_CAPACITY,
      booked: 0,
      remaining: DAILY_CAPACITY,
      isFull: false,
    };
  }

  const orders = await getOrders();

  const booked = orders.filter(
    (order) =>
      order.dueDate === dueDate &&
      ACTIVE_STATUSES.includes(order.status)
  ).length;

  return {
    maximum: DAILY_CAPACITY,
    booked,
    remaining: Math.max(DAILY_CAPACITY - booked, 0),
    isFull: booked >= DAILY_CAPACITY,
  };

};
