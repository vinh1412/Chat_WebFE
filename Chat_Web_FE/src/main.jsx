import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Provider } from "react-redux";
import store from "./redux/store.js";
import App from "./App.jsx";

import DashboardProvider from "./context/provider/DashboardProvider.jsx";
const DashboardPage = React.lazy(() => import("./pages/DashboardPage.jsx"));
const LayoutDashboard = React.lazy(() =>
  import("./components/layout/LayoutDashboard.jsx")
);
const LoginPage = React.lazy(() => import("./pages/LoginPage.jsx"));
const RegisterStepPhone = React.lazy(() => import("./pages/Register/RegisterStepPhone.jsx"));
const RegisterStepOTP = React.lazy(() => import("./pages/Register/RegisterStepOTP.jsx"));
const RegisterStepInfo = React.lazy(() =>import("./pages/Register/RegisterStepInfo.jsx"))

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
  {
    path: "/login",
    element: <LoginPage />, 
  },
  {
    path: "/register",
    element: <RegisterStepPhone />,
  },
  {
    path: "/register/otp",
    element: <RegisterStepOTP />,
  },
  {
    path: "/register/info",
    element: <RegisterStepInfo />,
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <DashboardProvider>
        <App>
          <RouterProvider router={router}></RouterProvider>
        </App>
      </DashboardProvider>
    </Provider>
   
  </StrictMode>
);
