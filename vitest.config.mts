import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [react()],
    resolve: {
        tsconfigPaths: true,
        alias: {
            "server-only": path.resolve(here, "./lib/test/empty-module.ts"),
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        server: {
            deps: { inline: ["server-only"] },
        },
    },
});
