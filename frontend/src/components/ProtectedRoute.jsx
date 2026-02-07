import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    // Not logged in
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Role mismatch
    if (role && role !== userRole) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
