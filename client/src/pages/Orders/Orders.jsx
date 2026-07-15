import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./Orders.css";
import { getOrders, updateOrder, deleteOrder } from "../../services/orderService";
import { savePayment, getTotalPaid } from "../../services/paymentService";
import { generatePaymentId } from "../../utils/paymentIdGenerator";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [alreadyPaid, setAlreadyPaid] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const data = await getOrders();
        if (isMounted) setOrders(data || []);
      } catch (error) {
        console.error("Error loading orders:", error);
        alert("Failed to load orders");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };



  const handleEdit = (order) => {
    setEditingOrder(order);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    if (editingOrder.status === "Delivered" && !editingOrder.deliveredDate) {
      alert("Select Delivery Date");
      return;
    }

    try {
      await updateOrder(editingOrder);
      alert("Order Updated Successfully ✅");
      setEditingOrder(null);
      await loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId);
        alert("Order Deleted Successfully ✅");
        await loadOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      }
    }
  };

  const handlePayment = async (order) => {
    setPaymentOrder(order);
    setPaymentAmount("");
    setAlreadyPaid(await getTotalPaid(order.orderId));
  };

  const handleSavePayment = async () => {
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    const balance = Number(paymentOrder.totalAmount) - alreadyPaid;
    if (Number(paymentAmount) > balance) {
      alert("Payment exceeds the remaining balance.");
      return;
    }

    try {
      await savePayment({
        paymentId: generatePaymentId(),
        orderId: paymentOrder.orderId,
        customerName: paymentOrder.customerName,
        amount: Number(paymentAmount),
        date: new Date().toISOString().split("T")[0],
      });

      alert("Payment Saved Successfully ✅");
      setAlreadyPaid(await getTotalPaid(paymentOrder.orderId));
      setPaymentOrder(null);
      await loadOrders();
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment");
    }
  };

  return (
    <Layout>
      <div className="orders-container">
        <div className="orders-header">
          <h1>Orders</h1>
        </div>
	
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Dress</th>
                <th>Booking</th>
                <th>Due</th>
                <th>Delivery Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10">Loading Orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="10">No Orders Found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.customerName}</td>
                    <td>{order.phoneNumber}</td>
                    <td>{order.dressType}</td>
                    <td>{order.bookingDate || "-"}</td>
                    <td>{order.dueDate || "-"}</td>
                    <td>{order.deliveredDate || "-"}</td>
                    <td>₹ {order.totalAmount || 0}</td>
                    <td>{order.status}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(order)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(order.orderId)}
                        >
                          Delete
                        </button>
                        <button
                          className="action-btn pay-btn"
                          onClick={() => handlePayment(order)}
                        >
                          Payment
                        </button>
                        <button
                          className="action-btn invoice-btn"
                          onClick={() => navigate(`/invoice/${order.orderId}`)}
                        >
                          Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingOrder && (
        <div className="edit-popup" onClick={() => setEditingOrder(null)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Order</h2>

            <label>Status</label>
            <select
              value={editingOrder.status}
              onChange={(e) => {
                const status = e.target.value;
                setEditingOrder({
                  ...editingOrder,
                  status,
                  deliveredDate:
                    status === "Delivered" && !editingOrder.deliveredDate
                      ? today
                      : editingOrder.deliveredDate,
                });
              }}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Delivered</option>
            </select>

            {editingOrder.status === "Delivered" ? (
              <>
                <label>Delivery Date</label>
                <input
                  type="date"
                  value={editingOrder.deliveredDate || ""}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      deliveredDate: e.target.value,
                    })
                  }
                />
              </>
            ) : (
              <>
                <label>Due Date</label>
                <input
                  type="date"
                  value={editingOrder.dueDate || ""}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      dueDate: e.target.value,
                    })
                  }
                />
              </>
            )}

            <div className="popup-buttons">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditingOrder(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {paymentOrder && (
        <div className="edit-popup" onClick={() => setPaymentOrder(null)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>Payment for Order {paymentOrder.orderId}</h2>

            <p>
              <strong>Total Amount:</strong> ₹ {paymentOrder.totalAmount}
            </p>
            <p>
              <strong>Already Paid:</strong> ₹ {alreadyPaid}
            </p>
            <p>
              <strong>Balance:</strong> ₹{" "}
              {Number(paymentOrder.totalAmount) - alreadyPaid}
            </p>

            <label>Payment Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />

            <div className="popup-buttons">
              <button onClick={handleSavePayment}>Save Payment</button>
              <button onClick={() => setPaymentOrder(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Orders;
