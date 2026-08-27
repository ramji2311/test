import Login from "../pages/Login/Login";

import Dashboard from "../pages/Dashboard/Dashboard";

import NewOrder from "../pages/NewOrder/NewOrder";

import Orders from "../pages/Orders/Orders";
import Customers from "../pages/Customers/Customers";

import Calendar from "../pages/Calendar/Calendar";

import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";

import Invoice from "../pages/Invoice/Invoice";

import Measurements from "../pages/Measurements/Measurements";

import Employees from "../pages/Employees/Employees";

import ProtectedRoute from "../ProtectedRoute";
import Tailors from "../pages/Tailors/Tailors";

import SalarySlip from "../pages/SalarySlip/SalarySlip";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Salary from "../pages/Salary/Salary";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* New Order */}
        <Route
          path="/new-order"
          element={
            <ProtectedRoute>
              <NewOrder />
            </ProtectedRoute>
          }
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Customers */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* Measurements */}
        <Route
          path="/measurements"
          element={
            <ProtectedRoute>
              <Measurements />
            </ProtectedRoute>
          }
        />
<Route
  path="/tailors"
  element={
    <ProtectedRoute>
      <Layout>
        <Tailors />
      </Layout>
    </ProtectedRoute>
  }
/>
        {/* Calendar */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Employees */}
      <Route
  path="/employees"
  element={
    <ProtectedRoute>
      <Layout>
        <Employees />
      </Layout>
    </ProtectedRoute>
  }
/>

        {/* Invoice */}
        <Route
          path="/invoice/:orderId"
          element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          }
        />
<Route
  path="/salary"
  element={
    <ProtectedRoute>
      <Layout>
        <Salary />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/salary-slip"
  element={
    <ProtectedRoute>
      <Layout>
        <SalarySlip />
      </Layout>
    </ProtectedRoute>
  }
/>
        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}