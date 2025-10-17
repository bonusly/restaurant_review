// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// Route paths
export enum Routes {
  Home = "/",
  Login = "/login",
  Register = "/register",
  Dashboard = "/dashboard",
  RestaurantDetail = "/restaurants/:id",
}

// Helper functions for route generation
export const generateRoutes = {
  restaurantDetail: (id: number) => `/restaurants/${id}`,
};

// Local storage keys
export enum StorageKeys {
  AuthToken = "auth_token",
  UserPreferences = "user_preferences",
}

// Form validation messages
export enum ValidationMessages {
  Required = "This field is required",
  EmailInvalid = "Please enter a valid email address",
  PasswordMinLength = "Password must be at least 8 characters",
  PasswordMismatch = "Passwords do not match",
  LoginFailed = "Login failed. Please check your credentials and try again.",
  RegistrationFailed = "Registration failed. Please try again.",
}

// HTTP status codes
export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  UnprocessableEntity = 422,
  InternalServerError = 500,
}

// Query stale times (in milliseconds)
export enum StaleTime {
  Never = Infinity,
  Short = 30 * 1000, // 30 seconds
  Medium = 5 * 60 * 1000, // 5 minutes
  Long = 30 * 60 * 1000, // 30 minutes
}
