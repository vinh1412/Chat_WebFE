import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Provider } from "react-redux";
import store from "./redux/store.js";
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
        element: <DashboardPage />, // hiển thị bên trong layout chính
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App>
        <RouterProvider router={router}></RouterProvider>
      </App>
    </Provider>
   
  </StrictMode>
);
