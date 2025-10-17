import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/query-client";

// Import route components
import { AuthCheck } from "./components/auth/AuthCheck";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { Restaurants } from "./pages/Restaurants";
import { RestaurantDetail } from "./pages/RestaurantDetail";
import { restaurantDetailLoader } from "./queries/restaurants";
import { Routes } from "./utils/constants";

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthCheck />,
    children: [
      {
        index: true,
        element: <Restaurants />,
      },
      {
        path: "login",
        element: (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <LoginForm />
          </div>
        ),
      },
      {
        path: "register",
        element: (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <RegisterForm />
          </div>
        ),
      },
      {
        path: "dashboard",
        element: <Restaurants />,
      },
      {
        path: "restaurants/:id",
        element: <RestaurantDetail />,
        loader: restaurantDetailLoader,
      },
      {
        path: "*",
        element: (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="card max-w-md w-full text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Page Not Found
              </h2>
              <p className="text-gray-600 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="space-y-3">
                <a href={Routes.Dashboard} className="btn-primary w-full block">
                  Go to Dashboard
                </a>
                <a href={Routes.Login} className="btn-secondary w-full block">
                  Go to Login
                </a>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
