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
        passes: 2
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        // Aggressiveres Code-Splitting
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('vue')) {
              return 'vue-core'
            }
            if (id.includes('router')) {
              return 'vue-router'
            }
            if (id.includes('pinia')) {
              return 'pinia'
            }
            if (id.includes('primeflex')) {
              return 'primeflex'
            }
            return 'vendor'
          }
          // Route-basiertes Splitting
          if (id.includes('/views/')) {
            const match = id.match(/\/views\/([^/]+)\.vue/)
            if (match) {
              return `view-${match[1].toLowerCase()}`
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
    chunkSizeWarningLimit: 400,
    // Preload strategy
    modulePreload: {
      polyfill: false
    },
    // Optimize CSS
    cssCodeSplit: true
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
