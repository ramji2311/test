import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoice } from "../../services/invoiceService";
import { formatDateTime12h, formatDateOnly } from "../../utils/dateFormatter";
import "./Invoice.css";

function Invoice() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadInvoice = async () => {
      const invoice = await getInvoice(orderId);
      if (isMounted) {
        setOrder(invoice || null);
        setLoading(false);
      }
    };

    loadInvoice();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return <h2>Loading Invoice...</h2>;
  }

  if (!order) {
    return <h2>Invoice Not Found</h2>;
  }

  return (
    <div className="invoice-container">

      <div className="invoice">

        {/* Header */}

        <div className="invoice-header">

          <h1>MIARA DESIGNER HOUSE</h1>

          <p>
            No.5 LIC Nagar,
            <br />
            Moolapalayam, Erode
          </p>

          <h3>INVOICE</h3>

        </div>

        <hr />

        {/* Invoice Info */}

        <div className="invoice-top">

          <div>

            <p><strong>Invoice No :</strong> {order.orderId}</p>

            <p><strong>Date :</strong> {formatDateTime12h(order.bookingDate)}</p>

          </div>

          <div>

            <p><strong>Status :</strong> {order.status}</p>

            <p><strong>Delivery :</strong> {formatDateOnly(order.dueDate)}</p>

          </div>

        </div>

        <hr />

        {/* Customer */}

        <h3 className="section-title">
          Customer Details
        </h3>

        <div className="customer-box">

          <p><strong>Name :</strong> {order.customerName}</p>

          <p><strong>Phone :</strong> {order.phoneNumber}</p>

        </div>

        {/* Dress */}

        <h3 className="section-title">
          Order Details
        </h3>

        <table className="invoice-table">

          <thead>

            <tr>
              <th>Dress Type</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td>{order.dressType}</td>
              <td>{order.quantity}</td>
              <td>₹ {order.totalAmount}</td>
            </tr>

          </tbody>

        </table>

        {/* Payment */}

        <h3 className="section-title">
          Payment Summary
        </h3>

        <div className="payment-box">

          <div>
            <span>Total Amount</span>
            <strong>₹ {order.totalAmount}</strong>
          </div>

          <div>
            <span>Advance Paid</span>
            <strong>₹ {order.advanceAmount}</strong>
          </div>

          <div className="balance-row">
            <span>Balance</span>
            <strong>₹ {order.balanceAmount}</strong>
          </div>

        </div>

        {/* Footer */}

        <div className="invoice-footer">

          <p>
            Thank you for choosing
          </p>

          <h2>Miara Designer House ❤️</h2>

        </div>

        <button
          className="print-btn"
          onClick={() => window.print()}
        >
          🖨 Print Invoice
        </button>

      </div>

    </div>
  );
}

export default Invoice;
