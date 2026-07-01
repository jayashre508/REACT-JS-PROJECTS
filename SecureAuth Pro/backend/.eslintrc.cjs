module.exports = {
  root: true,
  env: { node: true, es2021: true },
  parserOptions: { ecmaVersion: 'latest' },
  extends: ['eslint:recommended'],
  plugins: ['import'],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/no-unresolved': 'off'
  }
}

