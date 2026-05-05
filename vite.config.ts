import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// 1x1 transparent PNG, used as a placeholder for unresolved figma:asset/* imports
// (this project was exported from Figma Make and the original binary assets are not bundled).
const TRANSPARENT_PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

function figmaAssetPlaceholder() {
  const virtualPrefix = '\0figma-asset:'
  return {
    name: 'figma-asset-placeholder',
    enforce: 'pre' as const,
    resolveId(source: string) {
      if (source.startsWith('figma:asset/')) {
        return virtualPrefix + source
      }
      return null
    },
    load(id: string) {
      if (id.startsWith(virtualPrefix)) {
        return `export default ${JSON.stringify(TRANSPARENT_PNG_DATA_URL)};`
      }
      return null
    },
  }
}

export default defineConfig({
  // Repository name on GitHub — required so assets resolve under
  // https://oommiemie.github.io/Metaherb/. In dev, Vite ignores trailing repo path.
  base: process.env.NODE_ENV === 'production' ? '/Metaherb/' : '/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetPlaceholder(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
