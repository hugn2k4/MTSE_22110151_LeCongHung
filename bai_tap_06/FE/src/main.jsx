import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthWrapper } from "./components/context/auth.context.jsx";
import ForgotPasswordPage from "./pages/forgot-password.jsx";
import HomePage from "./pages/home-new.jsx";
import LoginPage from "./pages/login.jsx";
import ProductDetailPage from "./pages/product-detail.jsx";
import RegisterPage from "./pages/register.jsx";
import SearchPage from "./pages/search.jsx";
import UserPage from "./pages/user.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);
