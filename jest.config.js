/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    // Redirect ESM pi SDK to manual mock (Jest CJS can't resolve ESM modules)
    '@earendil-works/pi-coding-agent': '<rootDir>/__mocks__/pi-coding-agent.ts',
  },
};