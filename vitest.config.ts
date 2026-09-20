import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
  },
  test: {
    exclude: ["tests/e2e/**", "node_modules/**"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "src/app/api/**/*.{ts,tsx}",
        "src/features/**/*.{ts,tsx}",
        "src/i18n/**/*.{ts,tsx}",
        "src/lib/**/*.{ts,tsx}",
        "src/sanity/repositories/**/*.{ts,tsx}"
      ],
      exclude: [
        "node_modules/**",
        ".next/**",
        "**/*.config.*",
        "**/*.d.ts",
        "**/*.test.*",
        "**/*.spec.*",
        "src/test/**",
        "src/**/models.ts"
      ],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 58,
        lines: 63
      }
    }
  }
});
