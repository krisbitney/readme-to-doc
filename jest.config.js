module.exports = {
  collectCoverage: false,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**tests/**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/.polywrap/"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest", {
        tsconfig: "tsconfig.json",
        diagnostics: false
      }]
  },
};
