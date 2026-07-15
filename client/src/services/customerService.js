import { getOrders } from "./orderService";

const STORAGE_KEY = "miara_customers";

const getStoredCustomers = () => {
  const customers = localStorage.getItem(STORAGE_KEY);
  return customers ? JSON.parse(customers) : [];
};

const normalizeCustomer = (customer) => ({
  customerName: customer.customerName || "",
  phoneNumber: customer.phoneNumber || "",
});

const mergeCustomer = (customers, customer) => {
  const normalizedCustomer = normalizeCustomer(customer);

  if (!normalizedCustomer.phoneNumber) return customers;

  const existingCustomer = customers.find(
    (item) => item.phoneNumber === normalizedCustomer.phoneNumber
  );

  if (!existingCustomer) {
    customers.push(normalizedCustomer);
  } else if (!existingCustomer.customerName && normalizedCustomer.customerName) {
    existingCustomer.customerName = normalizedCustomer.customerName;
  }

  return customers;
};

export const getCustomers = async () => {
  const customers = getStoredCustomers().reduce(
    (items, customer) => mergeCustomer(items, customer),
    []
  );

  try {
    const orders = await getOrders();

    orders.forEach((order) => {
      mergeCustomer(customers, {
        customerName: order.customerName,
        phoneNumber: order.phoneNumber,
      });
    });
  } catch (error) {
    console.error("GET Customers Error:", error.response?.data || error.message);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));

  return customers;
};

export const saveCustomer = (customer) => {
  const customers = getStoredCustomers();

  const exists = customers.find(
    (c) => c.phoneNumber === customer.phoneNumber
  );

  if (!exists) {
    customers.push(customer);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(customers)
    );
  }
};

export const deleteCustomer = (phoneNumber) => {
  const customers = getStoredCustomers().filter(
    (customer) => customer.phoneNumber !== phoneNumber
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(customers)
  );
};

export const getCustomerOrders = async (phoneNumber) => {
  const orders = await getOrders();

  return orders.filter(
    (order) => order.phoneNumber === phoneNumber
  );
};

export const updateCustomer = (updatedCustomer) => {

  const customers = getStoredCustomers();

  const updatedCustomers = customers.map((customer) =>
    customer.phoneNumber === updatedCustomer.phoneNumber
      ? updatedCustomer
      : customer
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedCustomers)
  );

};
