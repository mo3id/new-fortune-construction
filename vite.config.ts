import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { existsSync } from 'node:fs'
import { dirname, resolve as resolvePath } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const resolvePkgEntry = (pkgName: string, candidates: string[]) => {
  try {
    const pkgJsonPath = require.resolve(`${pkgName}/package.json`)
    const baseDir = dirname(pkgJsonPath)
    for (const rel of candidates) {
      const p = resolvePath(baseDir, rel)
      if (existsSync(p)) return p
    }
    return pkgName
  } catch {
    return pkgName
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      '@fortune/shared-ui': fileURLToPath(new URL('./src/lib/frontendSharedUi.tsx', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'react-style-singleton': resolvePkgEntry('react-style-singleton', [
        'dist/es5/index.js',
        'dist/commonjs/index.js',
      ]),
      'react-remove-scroll': resolvePkgEntry('react-remove-scroll', [
        'dist/es5/index.js',
        'dist/commonjs/index.js',
      ]),
      'react-remove-scroll-bar/constants': resolvePkgEntry('react-remove-scroll-bar', [
        'dist/es5/constants.js',
        'dist/commonjs/constants.js',
      ]),
      'react-remove-scroll-bar': resolvePkgEntry('react-remove-scroll-bar', [
        'dist/es5/index.js',
        'dist/commonjs/index.js',
      ]),
    },
  },
})
