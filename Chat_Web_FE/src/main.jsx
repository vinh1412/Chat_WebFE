import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

import App from "./App.jsx";

const DashboardPage = React.lazy(() => import("./pages/DashboardPage.jsx"));
const LayoutDashboard = React.lazy(() =>
  import("./components/layout/LayoutDashboard.jsx")
);

// router
const router = createBrowserRouter([
  {
    element: <LayoutDashboard />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App>
      <RouterProvider router={router}></RouterProvider>
    </App>
  </StrictMode>
);
