module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json']
      }
    }
  },
  ignorePatterns: ['dist', 'coverage'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prefer-const': 'off',
    'import/no-unresolved': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/no-named-as-default': 'warn',
    'import/no-named-as-default-member': 'warn',
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always'
      }
    ]
  },
  overrides: [
    {
      files: ['tests/**/*'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ]
};
