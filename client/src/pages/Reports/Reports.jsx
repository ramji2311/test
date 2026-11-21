
import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./Reports.css";

import {
  getReportData,
  getOrdersByReport,
} from "../../services/reportService";

import { formatDateOnly } from "../../utils/dateFormatter";
import { printReport } from "../../utils/printHelper";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Reports() {
  // REPORT STATE
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD REPORT DATA
  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);

        const data = await getReportData();
        setReport(data);
      } catch (error) {
        console.error("Error loading report data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

  // FORMAT CURRENCY
  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // ORDER CHART DATA
  const orderChartData = [
    {
      name: "Orders Received",
      value: Number(report.totalOrders || 0),
    },
    {
      name: "Completed",
      value: Number(report.completedOrders || 0),
    },
    {
      name: "Pending",
      value: Number(report.pendingOrders || 0),
    },
  ];

  // FINANCIAL CHART DATA
  const financialChartData = [
    {
      name: "Total Order Amount",
      value: Number(report.totalRevenue || 0),
    },
    {
      name: "Payment Received",
      value: Number(report.paymentReceived || 0),
    },
    {
      name: "Pending Balance",
      value: Number(report.pendingBalance || 0),
    },
  ];

  // OPEN REPORT
  const handleReportClick = async (type) => {
    setSelectedReport(type);
    setFromDate("");
    setToDate("");
    setReportOrders([]);

    try {
      const orders = await getOrdersByReport(type);
      setReportOrders(orders || []);
    } catch (error) {
      console.error("Error loading report orders:", error);
      setReportOrders([]);
    }
  };

  // CLOSE REPORT
  const handleCloseReport = () => {
    setSelectedReport("");
    setFromDate("");
    setToDate("");
    setReportOrders([]);
  };

  // FILTER REPORT ORDERS
  const filteredReportOrders = useMemo(() => {
    return reportOrders.filter((order) => {
      let orderDate = "";

      if (selectedReport === "Pending Orders") {
        orderDate = order.dueDate
          ? order.dueDate.split("T")[0]
          : "";
      }

      if (selectedReport === "Completed Orders") {
        orderDate = order.deliveredDate
          ? order.deliveredDate.split("T")[0]
          : "";
      }

      if (
        selectedReport === "Pending Orders" ||
        selectedReport === "Completed Orders"
      ) {
        if (fromDate && orderDate < fromDate) {
          return false;
        }

        if (toDate && orderDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [reportOrders, selectedReport, fromDate, toDate]);

  // PRINT CURRENT REPORT
  const handlePrint = () => {
    printReport(selectedReport, filteredReportOrders);
  };

  // DIRECT PRINT FROM REPORT CARD
  const handleDirectPrint = async (e, type) => {
    e.stopPropagation();

    try {
      const orders = await getOrdersByReport(type);
      printReport(type, orders || []);
    } catch (error) {
      console.error("Error direct printing report:", error);
      alert("Failed to print report.");
    }
  };

  // RENDER
  return (
    <Layout>
      <div className="reports-container">
        <h1>Reports</h1>

        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <>
            {/* ORDER REPORT CARDS */}
            <div className="report-grid">

              {/* TOTAL ORDERS */}
              <div
                className="report-card"
                onClick={() => handleReportClick("Total Orders")}
              >
                <div className="card-header-with-print">
                  <h3>Total Orders</h3>
                </div>

                <h2>{report.totalOrders}</h2>
              </div>

              {/* PENDING ORDERS */}
              <div
                className="report-card"
                onClick={() => handleReportClick("Pending Orders")}
              >
                <div className="card-header-with-print">
                  <h3>Pending Orders</h3>

                  <button
                    className="card-print-shortcut"
                    onClick={(e) =>
                      handleDirectPrint(e, "Pending Orders")
                    }
                    title="Print Pending Orders"
                  >
                    🖨️
                  </button>
                </div>

                <h2>{report.pendingOrders}</h2>
              </div>

              {/* COMPLETED ORDERS */}
              <div
                className="report-card"
                onClick={() => handleReportClick("Completed Orders")}
              >
                <div className="card-header-with-print">
                  <h3>Completed Orders</h3>

                  <button
                    className="card-print-shortcut"
                    onClick={(e) =>
                      handleDirectPrint(e, "Completed Orders")
                    }
                    title="Print Completed Orders"
                  >
                    🖨️
                  </button>
                </div>

                <h2>{report.completedOrders}</h2>
              </div>

              {/* TODAY'S DELIVERIES */}
              <div
                className="report-card"
                onClick={() =>
                  handleReportClick("Today's Deliveries")
                }
              >
                <div className="card-header-with-print">
                  <h3>Today's Deliveries</h3>

                  <button
                    className="card-print-shortcut"
                    onClick={(e) =>
                      handleDirectPrint(e, "Today's Deliveries")
                    }
                    title="Print Today's Deliveries"
                  >
                    🖨️
                  </button>
                </div>

                <h2>{report.todaysDeliveries}</h2>
              </div>

            </div>

            {/* FINANCIAL SUMMARY */}
            <div className="financial-summary">

              <div className="financial-card">
                <div className="financial-icon">💰</div>

                <div className="financial-content">
                  <h3>Total Revenue</h3>
                  <h2>{formatCurrency(report.totalRevenue)}</h2>
                  <p>Total value of all orders</p>
                </div>
              </div>

              <div className="financial-card">
                <div className="financial-icon">💵</div>

                <div className="financial-content">
                  <h3>Payment Received</h3>
                  <h2>{formatCurrency(report.paymentReceived)}</h2>
                  <p>Amount received from customers</p>
                </div>
              </div>

              <div className="financial-card">
                <div className="financial-icon">⏳</div>

                <div className="financial-content">
                  <h3>Pending Balance</h3>
                  <h2>{formatCurrency(report.pendingBalance)}</h2>
                  <p>Amount still to be collected</p>
                </div>
              </div>

            </div>

            {/* CHARTS */}
            <section className="charts-row">

              {/* ORDER COMPARISON */}
              <div className="report-chart-section">
                <div className="report-chart-header">
                  <h2>Order Comparison</h2>
                  <p>
                    Orders received compared with completed and pending orders.
                  </p>
                </div>

                <div className="report-chart-container">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={orderChartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 15,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        name="Orders"
                        fill="#3B82F6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-legend">
                  <span>
                    <i className="legend-blue"></i>
                    Orders Received
                  </span>

                  <span>
                    <i className="legend-green"></i>
                    Completed
                  </span>

                  <span>
                    <i className="legend-orange"></i>
                    Pending
                  </span>
                </div>
              </div>

              {/* FINANCIAL COMPARISON */}
              <div className="report-chart-section">
                <div className="report-chart-header">
                  <h2>Financial Comparison</h2>
                  <p>
                    Total order value compared with payment received and
                    pending balance.
                  </p>
                </div>

                <div className="report-chart-container">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={financialChartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 5,
                        bottom: 15,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10 }}
                        interval={0}
                      />

                      <YAxis tick={{ fontSize: 10 }} />

                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                      />

                      <Bar
                        dataKey="value"
                        name="Amount"
                        fill="#3B82F6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-legend">
                  <span>
                    <i className="legend-blue"></i>
                    Total Order Amount
                  </span>

                  <span>
                    <i className="legend-green"></i>
                    Payment Received
                  </span>

                  <span>
                    <i className="legend-orange"></i>
                    Pending Balance
                  </span>
                </div>
              </div>

            </section>
          </>
        )}
      </div>

      {/* REPORT POPUP */}
      {selectedReport && (
        <div
          className="edit-popup"
          onClick={handleCloseReport}
        >
          <div
            className="popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedReport} List</h2>

            {/* DATE FILTERS */}
            {(selectedReport === "Pending Orders" ||
              selectedReport === "Completed Orders") && (
              <div className="popup-date-filters">

                <div className="popup-date-field">
                  <label>From Date:</label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="popup-date-field">
                  <label>To Date:</label>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

              </div>
            )}

            {/* REPORT TABLE */}
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Dress</th>
                    <th>Booking</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReportOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5">No Orders Found</td>
                    </tr>
                  ) : (
                    filteredReportOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.customerName}</td>
                        <td>{order.dressType}</td>
                        <td>
                          {formatDateOnly(order.bookingDate)}
                        </td>
                        <td>{order.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* POPUP ACTIONS */}
            <div className="popup-actions-wrapper">

              <button
                className="print-btn"
                onClick={handlePrint}
              >
                🖨️ Print
              </button>

              <button
                className="close-btn"
                onClick={handleCloseReport}
              >
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
