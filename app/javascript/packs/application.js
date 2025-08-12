// This is the main entry point for Shakapacker
// It loads React components for use with react-rails

import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

// Support component names relative to this directory:
var componentRequireContext = require.context("components", true);
var ReactRailsUJS = require("react_ujs");

// Make React available globally for react-rails
window.React = React;

// Provide compatibility for both old and new ReactDOM APIs
window.ReactDOM = {
  ...ReactDOM,
  createRoot: createRoot,
  // Fallback render method for react-rails compatibility
  render:
    ReactDOM.render ||
    function (element, container) {
      const root = createRoot(container);
      root.render(element);
      return root;
    },
};

// Initialize ReactRailsUJS with the component context
ReactRailsUJS.useContext(componentRequireContext);
