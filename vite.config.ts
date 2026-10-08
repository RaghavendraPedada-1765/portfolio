import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Use the package's exported source modules so shaders can be cached separately.
    alias: [{ find: /^three$/, replacement: "three/src/Three.js" }],
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // GLSL modules contain strings only, keeping initialization order safe.
            { name: "three-shaders", test: /node_modules\/three\/src\/renderers\/shaders\/.*\.glsl\.js$/, priority: 30 },
            { name: "three-core", test: /node_modules\/three\/src\//, priority: 20 },
            { name: "three-loaders", test: /node_modules\/three\/examples\/jsm\//, priority: 10 },
          ],
        },
      },
    },
  },
  server: {
    watch: { ignored: ["**/public/models/**", "**/public/images/**"] },
  },
});
