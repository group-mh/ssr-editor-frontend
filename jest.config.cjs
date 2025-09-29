module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};