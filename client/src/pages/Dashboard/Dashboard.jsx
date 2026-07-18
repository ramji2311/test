import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./Dashboard.css";

import Header from "../../components/Header/Header";
import { getDashboardStats } from "../../services/dashboardService";
import { getOrdersByReport } from "../../services/reportService";
import { formatDateOnly } from "../../utils/dateFormatter";
import { printReport } from "../../utils/printHelper";

function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    todaysOrders: 0,
    dueToday: 0,
    pendingOrders: 0,
    completedOrders: 0,
    recentOrders: [],
    upcomingDueOrders: [],
  });

  useEffect(() => {

    const loadDashboard = async () => {

      const data = await getDashboardStats();

      setStats(data);

    };

    loadDashboard();

  }, []);

  const handlePrintPending = async () => {
    try {
      const orders = await getOrdersByReport("Pending Orders");
      printReport("Pending Orders", orders);
    } catch (error) {
      console.error("Error direct printing pending orders:", error);
      alert("Failed to print report.");
    }
  };

  return (
    <div className="dashboard">

      {/* Header */}

      <Header />

      {/* Dashboard Cards */}

      <section className="dashboard-cards">

        <div className="card orders-card">
          <h3>Today's Orders</h3>
          <h2>{stats.todaysOrders}</h2>
        </div>

        <div className="card delivery-card">
          <h3>Due Today</h3>
          <h2>{stats.dueToday}</h2>
        </div>

        <div className="card pending-card">
          <h3>Pending Orders</h3>
          <h2>{stats.pendingOrders}</h2>
        </div>

        <div className="card completed-card">
          <h3>Completed Orders</h3>
          <h2>{stats.completedOrders}</h2>
        </div>

      </section>

      {/* Quick Actions */}

      <section className="quick-actions">

        <h2>Quick Actions</h2>

        <div className="button-grid">

          <button onClick={() => navigate("/new-order")}>
            ➕ New Order
          </button>

          <button onClick={() => navigate("/orders")}>
            📋 Orders
          </button>

          <button onClick={() => navigate("/customers")}>
            👤 Customers
          </button>

          <button onClick={() => navigate("/calendar")}>
            📅 Calendar
          </button>

          <button onClick={() => navigate("/reports")}>
            📊 Reports
          </button>

          <button onClick={() => navigate("/settings")}>
            ⚙️ Settings
          </button>

          <button className="print-action-btn" onClick={handlePrintPending}>
            🖨️ Print Pending
          </button>

        </div>

      </section>

      {/* Recent Orders */}

      <section className="recent-orders">

        <h2>Recent Orders</h2>

        <div className="table-responsive">
          <table>

            <thead>

              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Dress Type</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {stats.recentOrders.length === 0 ? (

                <tr>
                  <td colSpan="5">
                    No Orders Available
                  </td>
                </tr>

              ) : (

                stats.recentOrders.map((order) => (

                  <tr key={order.orderId}>

                    <td>{order.orderId}</td>

                    <td>{order.customerName}</td>

                    <td>{order.dressType}</td>

                    <td>{formatDateOnly(order.dueDate)}</td>

                    <td>{order.status}</td>

                  </tr>

                ))

              )}

            </tbody>

          </table>
        </div>

      </section>

      {/* Upcoming Due Orders */}

      <section className="recent-orders">

        <h2>Upcoming Due Orders</h2>

        <div className="table-responsive">
          <table>

            <thead>

              <tr>
                <th>Customer</th>
                <th>Dress</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {stats.upcomingDueOrders.length === 0 ? (

                <tr>
                  <td colSpan="4">
                    No Upcoming Orders
                  </td>
                </tr>

              ) : (

                stats.upcomingDueOrders.map((order) => (

                  <tr key={order.orderId}>

                    <td>{order.customerName}</td>

                    <td>{order.dressType}</td>

                    <td>{formatDateOnly(order.dueDate)}</td>

                    <td>{order.status}</td>

                  </tr>

                ))

              )}

            </tbody>

          </table>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;
