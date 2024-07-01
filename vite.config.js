import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Data-and-Algorithm-Visualizer/",
  plugins: [react()],
});
