module.exports = {
  root: true,
  env: { browser: true, node: true, es2021: true },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react', 'react-hooks', 'react-refresh'],
  extends: ['eslint:recommended', 'plugin:react-hooks/recommended'],
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
  }
}

