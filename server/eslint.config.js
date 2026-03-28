import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['node_modules/', 'dist/'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
    },
    extends: [js.configs.recommended],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
      'no-console': ['warn'],
    },
  },
])
