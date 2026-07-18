import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./Reports.css";
import {
  getReportData,
  getOrdersByReport,
} from "../../services/reportService";
import { formatDateTime12h, formatDateOnly } from "../../utils/dateFormatter";
import { printReport } from "../../utils/printHelper";

function Reports() {
  const [report, setReport] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todaysOrders: 0,
    todaysDeliveries: 0,
    totalRevenue: 0,
    paymentReceived: 0,
    pendingBalance: 0,
  });

  const [selectedReport, setSelectedReport] = useState("");
  const [reportOrders, setReportOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const data = await getReportData();
        setReport(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading report data:", error);
        setLoading(false);
      }
    };
    loadReportData();
  }, []);

  const handleReportClick = async (type) => {
    setSelectedReport(type);
    try {
      const orders = await getOrdersByReport(type);
      setReportOrders(orders);
    } catch (error) {
      console.error("Error loading report orders:", error);
      setReportOrders([]);
    }
  };

  const handlePrint = () => {
    printReport(selectedReport, reportOrders);
  };

  const handleDirectPrint = async (e, type) => {
    e.stopPropagation();
    try {
      const orders = await getOrdersByReport(type);
      printReport(type, orders);
    } catch (error) {
      console.error("Error direct printing report:", error);
      alert("Failed to print report.");
    }
  };

  return (
    <Layout>
      <div className="reports-container">

        <h1>Reports</h1>

        {loading ? (
          <p>Loading reports...</p>
        ) : (
        <div className="report-grid">

          <div
            className="report-card"
            onClick={() => handleReportClick("Total Orders")}
          >
            <div className="card-header-with-print">
              <h3>Total Orders</h3>
              <button
                className="card-print-shortcut"
                onClick={(e) => handleDirectPrint(e, "Total Orders")}
                title="Direct Print Total Orders"
              >
                🖨️
              </button>
            </div>
            <h2>{report.totalOrders}</h2>
          </div>

          <div
            className="report-card"
            onClick={() => handleReportClick("Pending Orders")}
          >
            <div className="card-header-with-print">
              <h3>Pending Orders</h3>
              <button
                className="card-print-shortcut"
                onClick={(e) => handleDirectPrint(e, "Pending Orders")}
                title="Direct Print Pending Orders"
              >
                🖨️
              </button>
            </div>
            <h2>{report.pendingOrders}</h2>
          </div>

          <div
            className="report-card"
            onClick={() => handleReportClick("Completed Orders")}
          >
            <div className="card-header-with-print">
              <h3>Completed Orders</h3>
              <button
                className="card-print-shortcut"
                onClick={(e) => handleDirectPrint(e, "Completed Orders")}
                title="Direct Print Completed Orders"
              >
                🖨️
              </button>
            </div>
            <h2>{report.completedOrders}</h2>
          </div>

          <div
            className="report-card"
            onClick={() => handleReportClick("Today's Orders")}
          >
            <div className="card-header-with-print">
              <h3>Today's Orders</h3>
              <button
                className="card-print-shortcut"
                onClick={(e) => handleDirectPrint(e, "Today's Orders")}
                title="Direct Print Today's Orders"
              >
                🖨️
              </button>
            </div>
            <h2>{report.todaysOrders}</h2>
          </div>

          <div
            className="report-card"
            onClick={() => handleReportClick("Today's Deliveries")}
          >
            <div className="card-header-with-print">
              <h3>Today's Deliveries</h3>
              <button
                className="card-print-shortcut"
                onClick={(e) => handleDirectPrint(e, "Today's Deliveries")}
                title="Direct Print Today's Deliveries"
              >
                🖨️
              </button>
            </div>
            <h2>{report.todaysDeliveries}</h2>
          </div>

          <div className="report-card">
            <h3>Total Revenue</h3>
            <h2>₹ {report.totalRevenue}</h2>
          </div>

          <div className="report-card">
            <h3>Payment Received</h3>
            <h2>₹ {report.paymentReceived}</h2>
          </div>

          <div className="report-card">
            <h3>Pending Balance</h3>
            <h2>₹ {report.pendingBalance}</h2>
          </div>

        </div>
        )}

      </div>

      {selectedReport && (
        <div
          className="edit-popup"
          onClick={() => setSelectedReport("")}
        >
          <div
            className="popup"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>{selectedReport} List</h2>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Dress</th>
                    <th>Booking</th>
                    <th>Due</th>
                    <th>Delivery Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {reportOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8">No Orders Found</td>
                    </tr>
                  ) : (
                    reportOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.customerName}</td>
                        <td>{order.phoneNumber}</td>
                        <td>{order.dressType}</td>
                        <td>{formatDateTime12h(order.bookingDate)}</td>
                        <td>{formatDateOnly(order.dueDate)}</td>
                        <td>{formatDateOnly(order.deliveredDate)}</td>
                        <td>{order.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="popup-actions-wrapper">
              {(selectedReport === "Pending Orders" || selectedReport === "Completed Orders") && (
                <button className="print-btn" onClick={handlePrint}>
                  🖨️ Print
                </button>
              )}
              <button className="close-btn" onClick={() => setSelectedReport("")}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </Layout>
  );

}

export default Reports;
