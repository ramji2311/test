import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaPlus,
  FaUsers,
  FaCalendar,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {

  return (

    <aside className="sidebar">

      <div className="logo">

        <h2>MIARA</h2>

        <p>Designer House</p>

      </div>

      <nav>

       <NavLink to="/dashboard">
  <FaHome />
  Dashboard
</NavLink>

        <NavLink to="/new-order">
          <FaPlus />
          New Order
        </NavLink>

        <NavLink to="/orders">
          <FaClipboardList />
          Orders
        </NavLink>

        <NavLink to="/customers">
          <FaUsers />
          Customers
        </NavLink>

        <NavLink to="/calendar">
          <FaCalendar />
          Calendar
        </NavLink>

        <NavLink to="/reports">
          <FaChartBar />
          Reports
        </NavLink>

        <NavLink to="/settings">
          <FaCog />
          Settings
        </NavLink>

      </nav>

    </aside>

  );
}

export default Sidebar;