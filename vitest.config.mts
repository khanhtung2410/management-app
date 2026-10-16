import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    resolve: {
        tsconfigPaths: true,   // ← native, không cần plugin
    },
    test: {
        environment: "jsdom",
        globals: true,
    },
});