import React, { useState, useEffect } from "react";

const RestaurantApp = ({ currentUser, message }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeApiCall = async () => {
    const apiMessage = message || "ping";

    setLoading(true);
    setError(null);

    try {
      // Get CSRF token from meta tag
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

      const response = await fetch("/api/test/ping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ message: apiMessage }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResponse(data.response);
      setError(null);
    } catch (err) {
      setResponse(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    makeApiCall();
  }, []);

  const apiMessage = message || "ping";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rails + React + API Demo
        </h1>
        <p className="text-lg text-gray-600">
          Demonstrating full-stack integration with authentication
        </p>
      </div>

      {/* Welcome Message */}
      {currentUser && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-5 h-5 text-green-400 mr-3">✅</div>
            <p className="text-green-800 font-medium">
              Authentication successful! Welcome, {currentUser.email}
            </p>
          </div>
        </div>
      )}

      {/* Demo Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          API Communication Test
        </h2>

        {/* Request Info */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Sending message to API endpoint:</p>
          <code className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm font-mono">
            POST /api/test/ping with message: "{apiMessage}"
          </code>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <span className="text-gray-600">Making API call...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-5 h-5 text-red-400 mr-3">❌</div>
              <div>
                <p className="text-red-800 font-medium">Error: {error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {response && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 w-5 h-5 text-green-400 mr-3">
                ✅
              </div>
              <p className="text-green-800 font-semibold">
                API Response Received:
              </p>
            </div>
            <code className="bg-green-100 text-green-800 px-3 py-2 rounded text-sm font-mono block mb-3">
              "{response}"
            </code>
            <p className="text-green-700 font-medium">
              🎉 Full stack communication working perfectly!
            </p>
          </div>
        )}

        {/* Retry Button */}
        <button
          onClick={makeApiCall}
          disabled={loading}
          className={
            loading
              ? "bg-gray-400 cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors"
              : "bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          }
        >
          {loading ? "Testing..." : "Test API Again"}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">
          How this integration works:
        </h3>
        <ol className="space-y-2 text-yellow-700">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold flex items-center justify-center mr-3 mt-0.5">
              1
            </span>
            <span>
              Rails controller passes "ping" as a prop to this React component
            </span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold flex items-center justify-center mr-3 mt-0.5">
              2
            </span>
            <span>
              Component makes a POST request to /api/test/ping with CSRF
              protection
            </span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold flex items-center justify-center mr-3 mt-0.5">
              3
            </span>
            <span>
              API controller validates authentication and responds with "pong"
            </span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold flex items-center justify-center mr-3 mt-0.5">
              4
            </span>
            <span>
              Component updates UI with the response, demonstrating full-stack
              integration
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default RestaurantApp;
