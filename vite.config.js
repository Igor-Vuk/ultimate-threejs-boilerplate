import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"
import { splitVendorChunkPlugin } from "vite"

export default {
  plugins: [react(), splitVendorChunkPlugin(), visualizer()],
  root: "src/",
  publicDir: "../public/",
  base: "./",
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1600, // remove 500kb warning
  },
}
