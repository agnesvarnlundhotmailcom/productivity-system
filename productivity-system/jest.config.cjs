module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  moduleFileExtensions: ["js", "jsx"],

  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};