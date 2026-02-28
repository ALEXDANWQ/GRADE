import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function resolveGithubPagesBase() {
  if (process.env.GITHUB_ACTIONS !== "true") {
    return "/";
  }

  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
  if (!repository || repository.toLowerCase().endsWith(".github.io")) {
    return "/";
  }

  return `/${repository}/`;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: resolveGithubPagesBase(),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'r3f-core': ['@react-three/fiber'],
          'drei-core': ['@react-three/drei'],
        },
      },
    },
  },
}));
