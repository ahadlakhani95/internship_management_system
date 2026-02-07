import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import Registration from "./pages/registration/Registration";
import ProtectedRoute from "./components/ProtectedRoute";
import CompanyDashboard from "./components/CompanyDashboard/CompanyDashboard";
import AddInternship from "./components/AddInternship/AddInternship";
import CompanyLayout from "./components/CompanyDashboard/CompanyLayout";
import CompanyHome from "./components/CompanyDashboard/CompanyHome";
import ManageInternship from "./components/ManageIntership/ManageIntership";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import ApplicationForm from "./components/Applicationform/Applicationform";
import CompanyApplicationList from "./components/CompanyApplicationList/CompanyApplicationList";
// Dashboards

const AdminDashboard = () => <h1>Admin Dashboard</h1>;

function App() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <>
      {/* <Navbar /> */}

      <Routes>

        {/* ROOT AUTO REDIRECT */}
        <Route
          path="/"
          element={
            token ? (
              role === "STUDENT" ? (
                <Navigate to="/student/dashboard" />
              ) : role === "COMPANY" ? (
                <Navigate to="/company/dashboard" />
              ) : (
                <Navigate to="/admin/dashboard" />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Protected Routes */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/student/apply/:id" element={<ApplicationForm />} />


        <Route
          path="/company"
          element={
            <ProtectedRoute role="COMPANY">
              <CompanyLayout />
            </ProtectedRoute>
          }
        > <Route index element={<CompanyHome />} />
          <Route path="dashboard" element={<CompanyHome />} />
          <Route path="add-internship" element={<AddInternship />} />
          <Route path="internships" element={<ManageInternship />} />
          <Route path="applications" element={<CompanyApplicationList />} />


        </Route>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;
