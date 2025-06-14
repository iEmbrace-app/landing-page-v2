import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Serve from root for development
  base: '/',

  plugins: [react()],

  server: {
    host: true,
    port: 5173,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Three.js into its own chunk
          three: ['three'],

          // Split React-Three-Fiber ecosystem
          'react-three': ['@react-three/fiber', '@react-three/drei'],

          // Split optimization utilities
          utils: [
            './src/utils/AnimationScheduler',
            './src/utils/LRUCache',
            './src/utils/SpatialHashGrid',
            './src/utils/FrustumCuller',
            './src/utils/PerformanceMonitor',
          ],

          // Split 3D components
          'three-components': [
            './src/components/three-d/ProceduralPebble',
            './src/components/three-d/SceneManager',
          ],
        },
      },
    },
  },

  // Static assets & service-worker files
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.woff', '**/*.woff2'],
})
