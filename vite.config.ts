import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Increase chunk size warning to 1MB so normal chunks don't spam warnings
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Manually split vendor code into separate cacheable chunks
          manualChunks(id) {
            // Firebase into its own chunk
            if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
              return 'firebase';
            }
            // Lucide icons (large icon library) into its own chunk
            if (id.includes('node_modules/lucide-react')) {
              return 'lucide';
            }
            // React core + DOM into vendor chunk
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
              return 'react-vendor';
            }
            // All other node_modules into a shared vendor chunk
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
