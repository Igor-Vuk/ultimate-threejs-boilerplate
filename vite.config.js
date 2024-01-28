import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"
import { splitVendorChunkPlugin } from "vite"
import vercel from "vite-plugin-vercel"

const isCodeSandbox =
  "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env

export default {
  plugins: [react(), splitVendorChunkPlugin(), vercel(), visualizer()],
  root: "src/",
  publicDir: "../public/",
  base: "./",
  server: {
    host: true,
    open: !isCodeSandbox, // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1600, // remove 500kb warning
  },
}
