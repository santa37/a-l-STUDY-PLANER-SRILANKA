import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    {
      name: "fix-html-for-local",
      closeBundle() {
        const htmlPath = path.resolve(__dirname, "dist/index.html");
        if (fs.existsSync(htmlPath)) {
          let html = fs.readFileSync(htmlPath, "utf-8");
          
          // Remove type="module" - CRITICAL for file:// protocol
          html = html.replace(/type="module"\s*/g, "");
          html = html.replace(/\s*crossorigin/g, "");
          
          // Move script to end of body if it's in head
          const scriptInHead = html.match(/<head>[\s\S]*?(<script>[\s\S]*?<\/script>)[\s\S]*?<\/head>/);
          if (scriptInHead && scriptInHead[1]) {
            const script = scriptInHead[1];
            html = html.replace(script, "");
            html = html.replace("</body>", script + "\n</body>");
          }
          
          fs.writeFileSync(htmlPath, html);
          console.log("✅ HTML fixed for local file:// protocol");
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2015",
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  base: "./",
});
