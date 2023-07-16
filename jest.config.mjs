/*
 * For a detailed explanation regarding each configuration property, visit:
 */
export default {
  clearMocks: true,
  restoreMocks: true,
  // collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },
  watchPathIgnorePatterns: ["node_modules"],
  transformIgnorePatterns: ["node_modules"],
  collectCoverageFrom: [
    "src/**/*.js","!src/**/index.js",
  ]
};