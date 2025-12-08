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

// Dashboard Pages - will create these next
const CitizenDashboard = () => <div>Citizen Dashboard - Coming Soon</div>;
const MyIssues = () => <div>My Issues - Coming Soon</div>;
const ReportIssue = () => <div>Report Issue - Coming Soon</div>;
const CitizenProfile = () => <div>Citizen Profile - Coming Soon</div>;

const StaffDashboard = () => <div>Staff Dashboard - Coming Soon</div>;
const AssignedIssues = () => <div>Assigned Issues - Coming Soon</div>;
const StaffProfile = () => <div>Staff Profile - Coming Soon</div>;

const AdminDashboard = () => <div>Admin Dashboard - Coming Soon</div>;
const AdminAllIssues = () => <div>Admin All Issues - Coming Soon</div>;
const ManageUsers = () => <div>Manage Users - Coming Soon</div>;
const ManageStaff = () => <div>Manage Staff - Coming Soon</div>;
const Payments = () => <div>Payments - Coming Soon</div>;
const AdminProfile = () => <div>Admin Profile - Coming Soon</div>;

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
