import api from "./api";

const STORAGE_KEY = "miara_orders";

const getOrdersFromStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveOrdersToStorage = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

const getOrderKey = (order) => order._id || order.orderId;

const formatDate = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.split("T")[0];

  return new Date(value).toISOString().split("T")[0];
};

const normalizeOrder = (order) => ({
  ...order,
  bookingDate: formatDate(order.bookingDate),
  dueDate: formatDate(order.dueDate),
  deliveryDate: formatDate(order.deliveryDate),
  deliveredDate: formatDate(order.deliveredDate),
  totalAmount: Number(order.totalAmount || 0),
  advanceAmount: Number(order.advanceAmount || 0),
  balanceAmount: Number(order.balanceAmount || 0),
});

const normalizeOrders = (orders = []) => orders.map(normalizeOrder);

const saveOrderToStorage = (order) => {
  const orders = getOrdersFromStorage();
  const savedOrder = normalizeOrder({
    ...order,
    _id: getOrderKey(order) || `local-${Date.now()}`,
  });
  const existingIndex = orders.findIndex(
    (item) => getOrderKey(item) === getOrderKey(savedOrder)
  );

  if (existingIndex >= 0) {
    orders[existingIndex] = savedOrder;
  } else {
    orders.unshift(savedOrder);
  }

  saveOrdersToStorage(orders);
  return savedOrder;
};

// Get Orders
export const getOrders = async () => {
  try {
    const res = await api.get("/orders");

    const orders = normalizeOrders(res.data.data);

    saveOrdersToStorage(orders);

    return orders;
  } catch (error) {
    console.error("GET Orders Error:", error.response?.data || error.message);

    return getOrdersFromStorage();
  }
};

// Save Order
export const saveOrder = async (order) => {
  try {
    const res = await api.post("/orders", order);
    const savedOrder = normalizeOrder(res.data.data);

    saveOrderToStorage(savedOrder);

    return savedOrder;
  } catch (error) {
    console.error("POST Order Error:");
    console.error(error.response?.data || error.message);

    throw error;
  }
};

// Update Order
export const updateOrder = async (order) => {
  try {
    const res = await api.put(`/orders/${getOrderKey(order)}`, order);
    const updatedOrder = normalizeOrder(res.data.data);

    saveOrderToStorage(updatedOrder);

    return updatedOrder;
  } catch (error) {
    console.error("UPDATE Order Error:");
    console.error(error.response?.data || error.message);

    throw error;
  }
};

// Delete Order
export const deleteOrder = async (id) => {
  try {
    await api.delete(`/orders/${id}`);
  } catch (error) {
    console.error("DELETE Order Error:");
    console.error(error.response?.data || error.message);

    throw error;
  }

  const orders = getOrdersFromStorage().filter(
    (order) => getOrderKey(order) !== id
  );

  saveOrdersToStorage(orders);
};
