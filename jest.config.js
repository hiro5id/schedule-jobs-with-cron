module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: [],
  coverageReporters: ['lcov', 'text', 'json', 'json-summary'],
  coverageProvider: 'babel',
  coverageDirectory: 'coverage/',
  collectCoverage: true,
  testTimeout: 60000,
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};
