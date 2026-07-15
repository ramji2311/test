import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import Layout from "../../components/Layout/Layout";
import "./Calendar.css";
import { getOrders } from "../../services/orderService";

function CalendarPage() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const filtered = orders.filter(
      (order) => order.dueDate === formattedDate
    );
    setSelectedOrders(filtered);
  }, [orders, selectedDate]);

  const loadOrdersForDate = (date) => {
    setSelectedDate(date);
  };

  return (
    <Layout>

      <div className="calendar-page">

        {/* Header */}

        <div className="calendar-header">

          <div>

            <h1>Calendar</h1>

            <p>
              Manage delivery dates, festivals and muhurtham days
            </p>

          </div>

          <button
            className="today-btn"
            onClick={() => loadOrdersForDate(new Date())}
          >
            Today
          </button>

        </div>

        {/* Main Content */}

        <div className="calendar-content">

          {/* Calendar */}

          <div className="calendar-left">

            <Calendar
              onChange={loadOrdersForDate}
              value={selectedDate}
            />

          </div>

          {/* Right Panel */}

          <div className="calendar-right">

            <h2>Selected Date</h2>

            <h1>
              {selectedDate.toDateString()}
            </h1>

            <hr />

            <h3>Orders on this Date</h3>

            <div className="orders-list">

              {selectedOrders.length === 0 ? (

                <div className="empty-box">
                  No Orders for this date
                </div>

              ) : (

                selectedOrders.map((order) => (

                  <div
                    key={order.orderId}
                    className="order-card"
                  >

                    <h3>{order.customerName}</h3>

                    <p>
                      <strong>Order:</strong> {order.orderId}
                    </p>

                    <p>
                      <strong>Dress:</strong> {order.dressType}
                    </p>

                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default CalendarPage;