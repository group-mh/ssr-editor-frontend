const { defineConfig } = require("cypress");

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,        
    },
  },
);
