import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  // Serve from root for development
  base: '/',

  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
    })
  ],

  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          vendor: ['react', 'react-dom'],
          
          // Split R2/AWS SDK (if used)
          'aws-sdk': ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
          
          // Split utilities
          utils: ['./src/utils/VideoManager', './src/utils/OptimizedVideoCache'],
        },
      },
    },
    
    // Additional optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },
  },

  // Static assets & service-worker files
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.woff', '**/*.woff2'],
})
