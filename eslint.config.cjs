const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');

module.exports = [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**']
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json']
        }
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...(importPlugin.configs.typescript ? importPlugin.configs.typescript.rules : {}),
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
    }
  },
  {
    files: ['tests/**/*'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
];
