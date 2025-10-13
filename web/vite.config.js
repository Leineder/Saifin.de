import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Optimize whitespace
          whitespace: 'condense'
        }
      }
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  base: '/',
  build: {
    target: 'es2020',
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3,
        // More aggressive compression
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true
      },
      format: {
        comments: false
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      output: {
        // ULTRA aggressive Code-Splitting for smaller initial bundles
        manualChunks(id) {
          // Vendor chunks - split more aggressively
          if (id.includes('node_modules')) {
            // Core Vue runtime
            if (id.includes('@vue/runtime-core') || id.includes('@vue/runtime-dom')) {
              return 'vue-core'
            }
            // Vue reactivity can be separate
            if (id.includes('@vue/reactivity')) {
              return 'vue-reactivity'
            }
            // Router separate
            if (id.includes('vue-router')) {
              return 'vue-router'
            }
            // Pinia separate
            if (id.includes('pinia')) {
              return 'pinia'
            }
            // Other vendor code
            return 'vendor'
          }
          // Route-basiertes Splitting - each view is its own chunk
          if (id.includes('/views/')) {
            const match = id.match(/\/views\/([^/]+)\.vue/)
            if (match) {
              return `view-${match[1].toLowerCase()}`
            }
          }
          // Split data files
          if (id.includes('/data/')) {
            const match = id.match(/\/data\/([^/]+)\.js/)
            if (match) {
              return `data-${match[1]}`
            }
          }
        },
        // Optimize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        }
      }
    },
    chunkSizeWarningLimit: 300,
    // Disable module preload polyfill for faster initial load
    modulePreload: {
      polyfill: false
    },
    // Aggressive CSS code splitting
    cssCodeSplit: true,
    // Reduce asset inlining threshold
    assetsInlineLimit: 2048,
    // Enable source map in production for better debugging (optional, can remove for smaller builds)
    sourcemap: false,
    // Optimize chunk size
    reportCompressedSize: false
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true
  },
  // Optimize deps
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
    exclude: []
  }
})
