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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
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
    setNewPaymentAmount("");
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

    // If newPaymentAmount is entered, process it
    if (newPaymentAmount && Number(newPaymentAmount) > 0) {
      const pAmt = Number(newPaymentAmount);
      const currentPaid = Number(updatedOrder.advanceAmount || 0);
      const balance = Number(updatedOrder.totalAmount || 0) - currentPaid;

      if (pAmt > balance) {
        alert("Payment exceeds the remaining balance.");
        return;
      }

      try {
        await savePayment({
          paymentId: generatePaymentId(),
          orderId: updatedOrder.orderId,
          customerName: updatedOrder.customerName,
          amount: pAmt,
          date: new Date().toISOString().split("T")[0],
        });

        updatedOrder.advanceAmount = currentPaid + pAmt;
        updatedOrder.balanceAmount = Number(updatedOrder.totalAmount || 0) - updatedOrder.advanceAmount;
      } catch (error) {
        console.error("Error saving payment:", error);
        alert("Failed to save payment transaction");
        return;
      }
    }

    try {
      await updateOrder(updatedOrder);
      alert("Order Updated Successfully ✅");
      setEditingOrder(null);
      setNewPaymentAmount("");
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
      // 1. Search term filter (Order Number, Customer Name, Phone Number)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        order.orderId.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.phoneNumber.toLowerCase().includes(searchLower);

      // 2. Date filter (applies only to Pending status)
      let matchesDate = true;
      if (fromDate || toDate) {
        if (order.status !== "Pending") {
          matchesDate = false;
        } else {
          const orderDate = order.bookingDate ? order.bookingDate.split("T")[0] : "";
          if (fromDate && orderDate < fromDate) matchesDate = false;
          if (toDate && orderDate > toDate) matchesDate = false;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, fromDate, toDate]);

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

        {/* Date Filter & Print Section */}
        <div className="pending-filter-container">
          <div className="date-inputs">
            <div className="date-field">
              <label>From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="date-field">
              <label>To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-actions">
            {(fromDate || toDate) && (
              <button
                className="clear-btn"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
              >
                Clear Filter
              </button>
            )}
            {fromDate && toDate && (
              <button className="print-btn" onClick={() => window.print()}>
                🖨 Print Pending List
              </button>
            )}
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
                <div className="form-group-full">
                  <label>Record New Payment (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount to add"
                    value={newPaymentAmount}
                    onChange={(e) => setNewPaymentAmount(e.target.value)}
                  />
                </div>
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

      {/* Printable Report Section */}
      <div className="print-only">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ color: "#6d4c41", margin: "0 0 5px 0" }}>MIARA DESIGNER HOUSE</h1>
          <h3 style={{ margin: 0, color: "#555" }}>Pending Orders Report</h3>
          {fromDate && toDate && (
            <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
              Period: {formatDateOnly(fromDate)} to {formatDateOnly(toDate)}
            </p>
          )}
        </div>
        <table className="print-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Order Date</th>
              <th>Customer Name</th>
              <th>Phone Number</th>
              <th>Order Details / Items</th>
              <th>Amount / Payment Status</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{formatDateOnly(order.bookingDate)}</td>
                <td>{order.customerName}</td>
                <td>{order.phoneNumber}</td>
                <td>
                  {order.dressType} (Qty: {order.quantity})
                </td>
                <td>
                  Total: ₹{order.totalAmount}
                  <br />
                  Paid: ₹{order.advanceAmount}
                  <br />
                  Bal: ₹{order.balanceAmount}
                </td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Orders;

