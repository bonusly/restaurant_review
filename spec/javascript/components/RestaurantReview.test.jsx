import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RestaurantReview from "../../../app/javascript/components/RestaurantReview";

// Mock fetch to prevent actual API calls during tests
global.fetch = jest.fn();

// Mock CSRF token
document.querySelector = jest.fn((selector) => {
  if (selector === 'meta[name="csrf-token"]') {
    return {
      getAttribute: () => "mock-csrf-token",
    };
  }
  return null;
});

describe("RestaurantReview Component", () => {
  const mockUser = {
    email: "test@example.com",
  };

  beforeEach(() => {
    fetch.mockClear();
    // Mock successful response to prevent actual API calls
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ response: "pong" }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders the main title and subtitle", () => {
      render(<RestaurantReview currentUser={mockUser} message="ping" />);

      expect(
        screen.getByText("Restaurant Review Platform"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Demonstrating full-stack integration with authentication",
        ),
      ).toBeInTheDocument();
    });

    it("renders API Communication Test section", () => {
      render(<RestaurantReview currentUser={mockUser} message="ping" />);

      expect(screen.getByText("API Communication Test")).toBeInTheDocument();
      expect(
        screen.getByText("Sending message to API endpoint:"),
      ).toBeInTheDocument();
    });

    it("displays instructions section", () => {
      render(<RestaurantReview currentUser={mockUser} message="ping" />);

      expect(
        screen.getByText("How this integration works:"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Rails controller passes.*ping.*as a prop/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Component makes a POST request/),
      ).toBeInTheDocument();
    });

    it("shows retry button", () => {
      render(<RestaurantReview currentUser={mockUser} message="ping" />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Authentication Display", () => {
    it("shows welcome message when user is authenticated", () => {
      render(<RestaurantReview currentUser={mockUser} message="ping" />);

      expect(
        screen.getByText(
          /Authentication successful! Welcome, test@example.com/,
        ),
      ).toBeInTheDocument();
    });

    it("does not show welcome message when user is not authenticated", () => {
      render(<RestaurantReview currentUser={null} message="ping" />);

      expect(
        screen.queryByText(/Authentication successful!/),
      ).not.toBeInTheDocument();
    });
  });

  describe("Message Prop Handling", () => {
    it("displays the provided message in the API endpoint description", () => {
      render(
        <RestaurantReview currentUser={mockUser} message="test-message" />,
      );

      expect(
        screen.getByText(/POST \/api\/test\/ping with message: "test-message"/),
      ).toBeInTheDocument();
    });

    it("uses 'ping' as default message when none provided", () => {
      render(<RestaurantReview currentUser={mockUser} />);

      expect(
        screen.getByText(/POST \/api\/test\/ping with message: "ping"/),
      ).toBeInTheDocument();
    });

    it("handles custom message props correctly", () => {
      render(<RestaurantReview currentUser={mockUser} message="hello" />);

      expect(
        screen.getByText(/POST \/api\/test\/ping with message: "hello"/),
      ).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("has proper CSS classes for styling", () => {
      const { container } = render(
        <RestaurantReview currentUser={mockUser} message="ping" />,
      );

      expect(container.querySelector(".max-w-4xl")).toBeInTheDocument();
      expect(container.querySelector(".text-center")).toBeInTheDocument();
      expect(container.querySelector(".bg-white")).toBeInTheDocument();
    });

    it("renders all instruction steps", () => {
      render(<RestaurantReview currentUser={mockUser} message="ping" />);

      // Check for numbered steps
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  describe("Props Validation", () => {
    it("handles missing currentUser prop", () => {
      render(<RestaurantReview message="ping" />);

      expect(
        screen.getByText("Restaurant Review Platform"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Authentication successful!/),
      ).not.toBeInTheDocument();
    });

    it("handles missing message prop", () => {
      render(<RestaurantReview currentUser={mockUser} />);

      expect(
        screen.getByText("Restaurant Review Platform"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/POST \/api\/test\/ping with message: "ping"/),
      ).toBeInTheDocument();
    });

    it("handles both props missing", () => {
      render(<RestaurantReview />);

      expect(
        screen.getByText("Restaurant Review Platform"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/POST \/api\/test\/ping with message: "ping"/),
      ).toBeInTheDocument();
    });
  });
});
