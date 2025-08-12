// By default, this pack is loaded for server-side rendering.
// It must expose react_ujs as `ReactRailsUJS` and prepare a require context.

import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

var componentRequireContext = require.context("components", true);
var ReactRailsUJS = require("react_ujs");

// Make React available globally for server-side rendering
global.React = React;

// Provide compatibility for both old and new ReactDOM APIs
global.ReactDOM = {
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

ReactRailsUJS.useContext(componentRequireContext);
