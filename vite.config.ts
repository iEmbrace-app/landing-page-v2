import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  // Serve from root for development
  base: '/landing-page-v2/',

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
    // Add file watching configuration to prevent crashes
    watch: {
      // Ignore files that don't need to be watched
      ignored: ['**/node_modules/**', '**/dist/**', '**/docs/**', '**/.git/**', '**/bundle-analysis.html'],
      // Use polling if you're on OneDrive or network drive
      usePolling: true,
      interval: 1000,
      // Limit the number of file watchers
      depth: 3
    },
    // Increase HMR timeout to prevent connection issues
    hmr: {
      timeout: 120000
    }
  },

  build: {
    outDir: 'docs',
    sourcemap: false, // Disable sourcemaps for production
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries for better caching
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['react-icons']
        },
        // Optimize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    
    // Additional optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.trace'],
        passes: 2 // Multiple passes for better compression
      },
      mangle: {
        safari10: true // Support Safari 10
      }
    },
    
    // Target modern browsers for better performance
    target: 'es2020',
    
    // Increase memory limit for building
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    
    // Enable gzip compression analysis
    reportCompressedSize: true
  },

  // Optimize dependency pre-bundling
  optimizeDeps: {
    // Force include dependencies that might be causing issues
    include: ['react', 'react-dom'],
    // Exclude any problematic dependencies
    exclude: [],
    // Increase the number of chunks for better memory management
    esbuildOptions: {
      target: 'es2020',
      // Limit memory usage during bundling
      keepNames: true,
    }
  },

  // Prevent memory leaks in development
  esbuild: {
    // Reduce memory usage
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },

  // Static assets & service-worker files
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.woff', '**/*.woff2'],
})