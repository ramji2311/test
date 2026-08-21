import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./Orders.css";
import { getOrders, updateOrder, deleteOrder } from "../../services/orderService";
import { savePayment } from "../../services/paymentService";
import { generatePaymentId } from "../../utils/paymentIdGenerator";
import { formatDateTime12h, formatDateOnly } from "../../utils/dateFormatter";
import { dressTypes } from "../../constants/dressTypes";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
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
    setEditingOrder({ ...order });
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    if (!editingOrder.customerName.trim()) {
      alert("Enter Customer Name");
      return;
    }
    if (!editingOrder.phoneNumber.trim() || editingOrder.phoneNumber.length !== 10) {
      alert("Phone Number must contain 10 digits");
      return;
    }
    if (editingOrder.status === "Delivered" && !editingOrder.deliveredDate) {
      alert("Select Delivery Date");
      return;
    }
    if (Number(editingOrder.advanceAmount || 0) > Number(editingOrder.totalAmount || 0)) {
      alert("Advance paid cannot exceed the total amount.");
      return;
    }

    let updatedOrder = { ...editingOrder };

    try {
      await updateOrder(updatedOrder);
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
        setEditingOrder(null);
        await loadOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      }
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        !searchTerm ||
        order.orderId.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.phoneNumber.toLowerCase().includes(searchLower)
      );
    });
  }, [orders, searchTerm]);

  return (
    <Layout>
      <div className="orders-container">
        <div className="orders-header">
          <h1>Orders</h1>
          <div className="orders-search">
            <input
              type="text"
              placeholder="Search by Order #, Customer, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-box"
            />
          </div>
        </div>


        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th className="hide-mobile">Phone</th>
                <th className="hide-mobile">Dress</th>
                <th className="hide-mobile">Booking</th>
                <th className="hide-mobile">Due</th>
                <th className="hide-mobile">Delivery Date</th>
                <th className="hide-mobile">Amount</th>
                <th className="hide-mobile">Status</th>
                <th className="hide-mobile">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10">Loading Orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="10">No Orders Found</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} onClick={() => handleEdit(order)}>
                    <td>{order.orderId}</td>
                    <td>{order.customerName}</td>
                    <td className="hide-mobile">{order.phoneNumber}</td>
                    <td className="hide-mobile">{order.dressType}</td>
                    <td className="hide-mobile">{formatDateTime12h(order.bookingDate)}</td>
                    <td className="hide-mobile">{formatDateOnly(order.dueDate)}</td>
                    <td className="hide-mobile">{formatDateOnly(order.deliveredDate)}</td>
                    <td className="hide-mobile">₹ {order.totalAmount || 0}</td>
                    <td className="hide-mobile">
                      <span className={`status ${order.status ? order.status.toLowerCase().replace(/\s+/g, "-") : "pending"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="hide-mobile">
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(order);
                          }}
                        >
                          Edit
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

      {/* Unified Edit Order Popup */}
      {editingOrder && (
        <div className="edit-popup" onClick={() => setEditingOrder(null)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Order</h2>

            <div className="popup-section">
              <h3>Order Details</h3>
              <div className="form-grid">
                <div className="form-group-half">
                  <label>Order Number</label>
                  <input
                    type="text"
                    value={editingOrder.orderId}
                    readOnly
                    className="readonly-input"
                  />
                </div>
                <div className="form-group-half">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={editingOrder.customerName}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, customerName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group-half">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={editingOrder.phoneNumber}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        phoneNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
                <div className="form-group-half">
                  <label>Dress Type</label>
                  <select
                    value={editingOrder.dressType}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, dressType: e.target.value })
                    }
                  >
                    {dressTypes.map((dress) => (
                      <option key={dress}>{dress}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group-half">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={editingOrder.quantity}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, quantity: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="form-group-full">
                  <label>Remarks</label>
                  <textarea
                    rows="2"
                    value={editingOrder.remarks || ""}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, remarks: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="popup-section">
              <h3>Payment & Billing</h3>
              <div className="form-grid">
                <div className="form-group-third">
                  <label>Total (₹)</label>
                  <input
                    type="number"
                    value={editingOrder.totalAmount || ""}
                    onChange={(e) => {
                      const total = Number(e.target.value) || 0;
                      setEditingOrder({
                        ...editingOrder,
                        totalAmount: total,
                        balanceAmount: total - (Number(editingOrder.advanceAmount) || 0),
                      });
                    }}
                  />
                </div>
                <div className="form-group-third">
                  <label>Paid (₹)</label>
                  <input
                    type="number"
                    value={editingOrder.advanceAmount || ""}
                    onChange={(e) => {
                      const adv = Number(e.target.value) || 0;
                      setEditingOrder({
                        ...editingOrder,
                        advanceAmount: adv,
                        balanceAmount: (Number(editingOrder.totalAmount) || 0) - adv,
                      });
                    }}
                  />
                </div>
                <div className="form-group-third">
                  <label>Balance (₹)</label>
                  <input
                    type="text"
                    value={editingOrder.balanceAmount || 0}
                    readOnly
                    className="readonly-input"
                  />
                </div>
              </div>
            </div>

            <div className="popup-section">
              <h3>Status & Delivery</h3>
              <div className="form-grid">
                <div className="form-group-half">
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
                    {editingOrder.status === "In Progress" && <option>In Progress</option>}
                    <option>Completed</option>
                    <option>Delivered</option>
                  </select>
                </div>

                {editingOrder.status === "Delivered" ? (
                  <div className="form-group-half">
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
                  </div>
                ) : (
                  <div className="form-group-half">
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
                  </div>
                )}
              </div>
            </div>

            <div className="popup-actions-row">
              <button className="btn-save" onClick={handleSaveEdit}>
                Save Changes
              </button>
              <button className="btn-cancel" onClick={() => setEditingOrder(null)}>
                Cancel
              </button>
              <button
                className="btn-invoice"
                onClick={() => {
                  setEditingOrder(null);
                  navigate(`/invoice/${editingOrder.orderId}`);
                }}
              >
                Invoice
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(editingOrder.orderId)}
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Orders;

