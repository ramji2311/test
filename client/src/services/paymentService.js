const STORAGE_KEY = "miara_payments";

export const getPayments = () => {
  const payments = localStorage.getItem(STORAGE_KEY);
  return payments ? JSON.parse(payments) : [];
};

export const savePayment = (payment) => {
  const payments = getPayments();

  payments.push(payment);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(payments)
  );
};

export const getOrderPayments = (orderId) => {
  return getPayments().filter(
    (payment) => payment.orderId === orderId
  );
};

export const getTotalPaid = (orderId) => {
  return getOrderPayments(orderId).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );
};

export const deletePayment = (paymentId) => {
  const updated = getPayments().filter(
    (payment) => payment.paymentId !== paymentId
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};