import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const inputIndex = process.argv.length - 1;
const input = process.argv[inputIndex]?.split("=")?.[1];
if (input) {
  console.log(`    Вход: [${input}]`);
}

const aliases = ["common", "content_script", "service_worker", "popup"];

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    copyPublicDir: input === "index.html",
    rollupOptions: {
      input: input,
      output: {
        [input ? "inlineDynamicImports" : "dummy"]: true,
        entryFileNames: "[name].js",
      },
    },
  },
  resolve: {
    alias: aliases.map((alias) => ({
      find: `@${alias}`,
      replacement: path.resolve(__dirname, `src/${alias}`),
    })),
  },
});
