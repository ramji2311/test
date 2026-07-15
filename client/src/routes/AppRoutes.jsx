import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

import ProtectedRoute from "../ProtectedRoute";

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

        {/* Invoice */}
        <Route
          path="/invoice/:orderId"
          element={
            <ProtectedRoute>
              <Invoice />
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