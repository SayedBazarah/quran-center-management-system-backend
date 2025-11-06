// jest.config.ts
const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    // MORE SPECIFIC MAPPINGS FIRST
    "^@/emails/(.*)$": "<rootDir>/emails/$1", // This must come before the general @/ mapping
    "^@/(.*)$": "<rootDir>/src/$1", // General @/ mapping comes last
  },

  transform: {
    ...tsJestTransformCfg,
  },
  // Ensure Jest knows to process .ts and .tsx files
  // ts-jest preset usually handles this, but explicitly adding it can help
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
