// src/routes/router.jsx

import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import AllIssues from "../pages/AllIssues";
import Login from "../pages/Login";
import Register from "../pages/Register";
import IssueDetails from "../pages/IssueDetails";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

// Citizen Dashboard Pages
import CitizenDashboard from "../pages/Dashboard/CitizenDashboard";
import MyIssues from "../pages/Dashboard/MyIssues";
import ReportIssue from "../pages/Dashboard/ReportIssue";
import CitizenProfile from "../pages/Dashboard/CitizenProfile";

// Staff Dashboard Pages
import StaffDashboard from "../pages/Dashboard/StaffDashboard";
import AssignedIssues from "../pages/Dashboard/AssignedIssues";
import StaffProfile from "../pages/Dashboard/StaffProfile";

// Admin Dashboard Pages
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import AdminAllIssues from "../pages/Dashboard/AdminAllIssues";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import ManageStaff from "../pages/Dashboard/ManageStaff";
import Payments from "../pages/Dashboard/Payments";
import AdminProfile from "../pages/Dashboard/AdminProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "all-issues",
        element: <AllIssues />,
      },
      {
        path: "issues/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },
      // Extra Public Pages
      {
        path: "reports",
        element: (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold">Reports Page</h1>
            <p className="mt-4">Placeholder for the main Reports and Statistics page.</p>
          </div>
        ),
      },
      {
        path: "resources",
        element: (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold">Resources Page</h1>
            <p className="mt-4">Placeholder for FAQs, contact info, or system documentation.</p>
          </div>
        ),
      },
      // Authentication Routes
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  // Dashboard Routes
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Citizen Dashboard Routes
      {
        path: "citizen",
        element: (
          <RoleRoute allowedRoles={['citizen']}>
            <CitizenDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "citizen/my-issues",
        element: (
          <RoleRoute allowedRoles={['citizen']}>
            <MyIssues />
          </RoleRoute>
        ),
      },
      {
        path: "citizen/report-issue",
        element: (
          <RoleRoute allowedRoles={['citizen']}>
            <ReportIssue />
          </RoleRoute>
        ),
      },
      {
        path: "citizen/profile",
        element: (
          <RoleRoute allowedRoles={['citizen']}>
            <CitizenProfile />
          </RoleRoute>
        ),
      },

      // Staff Dashboard Routes
      {
        path: "staff",
        element: (
          <RoleRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "staff/assigned-issues",
        element: (
          <RoleRoute allowedRoles={['staff']}>
            <AssignedIssues />
          </RoleRoute>
        ),
      },
      {
        path: "staff/profile",
        element: (
          <RoleRoute allowedRoles={['staff']}>
            <StaffProfile />
          </RoleRoute>
        ),
      },

      // Admin Dashboard Routes
      {
        path: "admin",
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "admin/all-issues",
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <AdminAllIssues />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <ManageUsers />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-staff",
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <ManageStaff />
          </RoleRoute>
        ),
      },
      {
        path: "admin/payments",
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <Payments />
          </RoleRoute>
        ),
      },
      {
        path: "admin/profile",
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <AdminProfile />
          </RoleRoute>
        ),
      },
    ],
  },
]);
