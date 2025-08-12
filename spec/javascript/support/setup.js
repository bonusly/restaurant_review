// Jest setup file for React Testing Library
import "@testing-library/jest-dom";

// Create a comprehensive mock for document.querySelector
const createMockElement = (attributes = {}) => ({
  getAttribute: jest.fn((attr) => attributes[attr] || null),
  setAttribute: jest.fn(),
  removeAttribute: jest.fn(),
});

// Mock document.querySelector with proper CSRF token support
Object.defineProperty(document, "querySelector", {
  value: jest.fn((selector) => {
    switch (selector) {
      case 'meta[name="csrf-token"]':
        return createMockElement({ content: "mock-csrf-token" });
      case 'meta[name="viewport"]':
        return createMockElement({
          content: "width=device-width,initial-scale=1",
        });
      default:
        return null;
    }
  }),
  writable: true,
  configurable: true,
});

// Mock fetch globally
global.fetch = jest.fn();

// Note: window.location is available by default in jsdom

// Reset all mocks before each test
beforeEach(() => {
  fetch.mockClear();
  document.querySelector.mockClear();

  // Reset fetch to return successful response by default
  fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ response: "pong" }),
    text: async () => '{"response":"pong"}',
  });
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Suppress console warnings in tests unless explicitly testing them
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render is no longer supported") ||
        args[0].includes("Warning: componentWillReceiveProps") ||
        args[0].includes("Warning: componentWillMount"))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render is no longer supported") ||
        args[0].includes("Error: Not implemented"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Mock timers for testing loading states
jest.useFakeTimers();

// Helper function to advance timers in tests
global.advanceTimers = (ms = 0) => {
  jest.advanceTimersByTime(ms);
};

// Cleanup timers after all tests
afterAll(() => {
  jest.useRealTimers();
});
