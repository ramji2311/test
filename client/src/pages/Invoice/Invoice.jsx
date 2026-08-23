import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./Invoice.css";
import { getOrders } from "../../services/orderService";
import { getTotalPaid } from "../../services/paymentService";

function Invoice() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [alreadyPaid, setAlreadyPaid] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadInvoice = async () => {
      try {
        const orders = await getOrders();
        const foundOrder = orders.find(
          (item) => String(item.orderId) === String(orderId)
        );

        if (!foundOrder) {
          if (isMounted) {
            alert("Order not found.");
            navigate("/orders");
          }
          return;
        }

        if (isMounted) {
          setOrder(foundOrder);
        }

        const paid = await getTotalPaid(orderId);
        if (isMounted) {
          setAlreadyPaid(paid);
        }
      } catch (error) {
        console.error("Error loading invoice:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInvoice();

    return () => {
      isMounted = false;
    };
  }, [orderId, navigate]);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="invoice-loading">Loading invoice...</div>
      </Layout>
    );
  }

  if (!order) {
    return null;
  }

  const balance = Number(order.totalAmount || 0) - alreadyPaid;

  return (
    <Layout>
      <div className="invoice-page">

        {/* TOP BAR — hidden on print */}
        <div className="invoice-top-bar">
          <button className="back-button" onClick={() => navigate("/orders")}>
            ← Back
          </button>

          <button className="print-button" onClick={handlePrint}>
            🖨️ Print Invoice
          </button>
        </div>

        {/* INVOICE SHEET */}
        <div className="invoice-sheet">

          {/* HEADER */}
          <div className="invoice-header">

            <div className="invoice-brand">
              <h1>MIARA</h1>
              <p>Tailoring &amp; Designer House</p>
              <p className="invoice-brand-contact">
                📍 Your Shop Address, City, State — 000000<br />
                📞 +91 00000 00000 &nbsp;|&nbsp; ✉️ contact@miara.in
              </p>
            </div>

            <div className="invoice-meta">
              <h2>INVOICE</h2>
              <div className="invoice-meta-row">
                <span>Invoice No.</span>
                <strong>#{order.orderId}</strong>
              </div>
              <div className="invoice-meta-row">
                <span>Booking Date</span>
                <strong>{formatDate(order.bookingDate)}</strong>
              </div>
              <div className="invoice-meta-row">
                <span>Status</span>
                <strong
                  className={`invoice-status ${order.status
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {order.status}
                </strong>
              </div>
            </div>

          </div>

          <div className="invoice-divider" />

          {/* CUSTOMER + ORDER INFO */}
          <div className="invoice-info-grid">

            <div className="invoice-info-block">
              <h3>Billed To</h3>
              <p className="invoice-customer-name">{order.customerName}</p>
              <p>{order.phoneNumber}</p>
            </div>

            <div className="invoice-info-block">
              <h3>Order Details</h3>
              <div className="invoice-info-row">
                <span>Due Date</span>
                <strong>{formatDate(order.dueDate)}</strong>
              </div>
              <div className="invoice-info-row">
                <span>Delivery Date</span>
                <strong>
                  {formatDate(order.deliveryDate || order.deliveredDate)}
                </strong>
              </div>
            </div>

          </div>

          {/* ITEMS TABLE */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="align-center">Quantity</th>
                <th className="align-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{order.dressType}</strong>
                  {order.remarks && (
                    <div className="invoice-remarks">{order.remarks}</div>
                  )}
                </td>
                <td className="align-center">{order.quantity || 1}</td>
                <td className="align-right">
                  ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>

          {/* TOTALS */}
          <div className="invoice-totals">

            <div className="invoice-totals-inner">

              <div className="invoice-totals-row">
                <span>Total Amount</span>
                <strong>
                  ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="invoice-totals-row">
                <span>Amount Paid</span>
                <strong className="paid-value">
                  ₹{alreadyPaid.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="invoice-totals-row balance-row">
                <span>Balance Due</span>
                <strong className={balance > 0 ? "due-value" : "settled-value"}>
                  ₹{balance.toLocaleString("en-IN")}
                </strong>
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="invoice-footer">
            <p>Thank you for choosing MIARA. We look forward to serving you again.</p>
            <p className="invoice-footer-note">
              This is a computer-generated invoice and does not require a signature.
            </p>
          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Invoice;
