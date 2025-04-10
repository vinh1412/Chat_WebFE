import React from "react";
import { Navigate } from "react-router-dom";
import { useDashboardContext } from "../../context/Dashboard_context";
import { Spinner } from "react-bootstrap";

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAuthLoading } = useDashboardContext();

  if (isAuthLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8f9fa",
        }}
      >
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-3 text-muted">🔐 Đang xác thực người dùng...</p>
      </div>
    );
  }
  // Nếu chưa đăng nhập, chuyển hướng về /login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
