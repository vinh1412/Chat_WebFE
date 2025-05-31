import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Provider } from "react-redux";
import store from "./redux/store.js";
import App from "./App.jsx";

import DashboardProvider from "./context/provider/DashboardProvider.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
const DashboardPage = React.lazy(() => import("./pages/DashboardPage.jsx"));
import ProtectedRoute from "./components/routing/ProtectedRoute";
// import GroupQRCodePage from "./pages/GroupQRCodePage.jsx";


const queryClient = new QueryClient();
const LayoutDashboard = React.lazy(() =>
  import("./components/layout/LayoutDashboard.jsx")
);
const LoginPage = React.lazy(() => import("./pages/LoginPage.jsx"));
const RegisterStepPhone = React.lazy(() =>
  import("./pages/Register/RegisterStepPhone.jsx")
);
const RegisterStepOTP = React.lazy(() =>
  import("./pages/Register/RegisterStepOTP.jsx")
);
const RegisterStepInfo = React.lazy(() =>
  import("./pages/Register/RegisterStepInfo.jsx")
);
// const GroupQRCodePage = React.lazy(() =>
//   import("./pages/GroupQRCodePage.jsx")
// );

const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <LayoutDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      }
      // ,
      // {
      //   path: "/group-qr-code/:conversationId",
      //   element: <GroupQRCodePage />,
      // },
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
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <DashboardProvider>
          <App>
            <RouterProvider router={router}></RouterProvider>
          </App>
        </DashboardProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
