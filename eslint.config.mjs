import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { flatConfigs } from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import pluginPromise from 'eslint-plugin-promise';
import globals from 'globals';

export default [
  js.configs.recommended,
  flatConfigs.recommended,
  nodePlugin.configs['flat/recommended-module'],
  pluginPromise.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true
      }
    },
    plugins: { 'no-relative-import-paths': noRelativeImportPaths },
    rules: {
      'no-relative-import-paths/no-relative-import-paths': [2, { rootDir: 'src', prefix: '@' }],
      'import/order': [2, { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
      'import/consistent-type-specifier-style': [2, 'prefer-inline'],
      'import/extensions': [2, 'ignorePackages'],
      'import/no-named-as-default-member': 0,
      'import/no-useless-path-segments': 2,
      'import/no-named-as-default': 0,
      'import/no-default-export': 2,
      'import/group-exports': 2,
      'jest/no-deprecated-functions': 0,
      'n/no-unsupported-features/node-builtins': 0,
      'n/no-missing-import': 0,
      'prefer-const': 2,
      eqeqeq: 2
    }
  }
]