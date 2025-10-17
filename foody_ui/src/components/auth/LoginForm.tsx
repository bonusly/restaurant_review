import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { ValidationMessages, Routes } from "../../utils/constants";
import type { LoginCredentials } from "../../queries/auth";
import { ErrorAlert } from "../common/ErrorAlert";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    emailAddress: "",
    password: "",
  });

  const { login, isLoggingIn, loginError, clearLoginError } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearLoginError();

    try {
      await login(credentials);
    } catch (error) {
      // Error is handled by the useAuth hook
      console.error("Login failed:", error);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (loginError) {
      clearLoginError();
    }
  };

  return (
    <div className="card max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={credentials.emailAddress}
            onChange={(e) => handleInputChange("emailAddress", e.target.value)}
            className="input-field"
            placeholder="Enter your email"
            required
            disabled={isLoggingIn}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="input-field"
            placeholder="Enter your password"
            required
            disabled={isLoggingIn}
          />
        </div>

        <ErrorAlert
          error={loginError}
          fallbackMessage={ValidationMessages.LoginFailed}
        />

        <button
          type="submit"
          disabled={isLoggingIn}
          className="btn-primary w-full"
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing In...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() =>
              onSwitchToRegister
                ? onSwitchToRegister()
                : navigate(Routes.Register)
            }
            className="text-blue-600 hover:text-blue-500 font-medium"
            disabled={isLoggingIn}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};
