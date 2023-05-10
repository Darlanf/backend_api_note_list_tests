export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },

  setupFilesAfterEnv: ["./jest.setup.js"],
  roots: ["<rootDir>/tests"],

  //configurações de cobertura de código.
  collectCoverageFrom: [
    "<rootDir>/src/app/**/*.ts",
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\",
  ],
};
