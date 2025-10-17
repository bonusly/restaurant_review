import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { ValidationMessages, Routes } from "../../utils/constants";
import type { RegisterCredentials } from "../../queries/auth";
import { ErrorAlert } from "../common/ErrorAlert";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    emailAddress: "",
    password: "",
    passwordConfirmation: "",
  });

  const { register, isRegistering, registerError, clearRegisterError } =
    useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearRegisterError();

    try {
      await register(credentials);
    } catch (error) {
      // Error is handled by the useAuth hook
      console.error("Registration failed:", error);
    }
  };

  const handleInputChange = (
    field: keyof RegisterCredentials,
    value: string,
  ) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (registerError) {
      clearRegisterError();
    }
  };

  return (
    <div className="card max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">Sign up for your Foody account</p>
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
            disabled={isRegistering}
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
            placeholder="Create a password"
            required
            disabled={isRegistering}
          />
        </div>

        <div>
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            value={credentials.passwordConfirmation}
            onChange={(e) =>
              handleInputChange("passwordConfirmation", e.target.value)
            }
            className="input-field"
            placeholder="Confirm your password"
            required
            disabled={isRegistering}
          />
        </div>

        <ErrorAlert
          error={registerError}
          fallbackMessage={ValidationMessages.RegistrationFailed}
        />

        <button
          type="submit"
          disabled={isRegistering}
          className="btn-primary w-full"
        >
          {isRegistering ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() =>
              onSwitchToLogin ? onSwitchToLogin() : navigate(Routes.Login)
            }
            className="text-blue-600 hover:text-blue-500 font-medium"
            disabled={isRegistering}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};
