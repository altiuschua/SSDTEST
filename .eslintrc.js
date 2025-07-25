module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
    'plugin:security-node/recommended',
    'plugin:no-unsanitized/recommended'
    
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'security',
    'security-node',
    'no-unsanitized'
  ],
  rules: {
    // Add security rules you need
    'security/detect-eval-with-expression': 'error', // Example rule
  }
};