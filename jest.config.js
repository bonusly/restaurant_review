module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/spec/javascript/support/setup.js"],
  testMatch: [
    "<rootDir>/spec/javascript/**/*.test.{js,jsx}",
    "<rootDir>/spec/javascript/**/*.spec.{js,jsx}",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/javascript/$1",
    "^components/(.*)$": "<rootDir>/app/javascript/components/$1",
  },
  collectCoverageFrom: [
    "app/javascript/**/*.{js,jsx}",
    "!app/javascript/**/*.test.{js,jsx}",
    "!app/javascript/**/*.spec.{js,jsx}",
  ],
  coverageDirectory: "coverage/javascript",
  coverageReporters: ["text", "lcov", "html"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/vendor/"],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
