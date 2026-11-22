import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import solid from 'eslint-plugin-solid';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Configure lint rules for maintained Lever UI source and tooling. */
export default tseslint.config(
  {
    ignores: [
      '.claude/**',
      '.tmp/**',
      '.leverui-declarations-*/**',
      'bin/**',
      'coverage/**',
      'dist/**',
      'examples/**/dist/**',
      'node_modules/**',
      'playwright-report/**',
      'storybook-static/**',
      'test-results/**',
      'website/dist/**',
      'website/.output/**',
      'website/.solid/**',
      'website/.vinxi/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    ...js.configs.recommended,
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { jsdoc },
    rules: {
      'max-lines': ['error', { max: 200, skipBlankLines: false, skipComments: false }],
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: tseslint.configs.recommended,
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['src/**/*.tsx', 'demos/**/*.tsx', 'website/src/**/*.tsx'],
    ...solid.configs.v2,
  },
  {
    files: ['**/*.gen.ts', 'tests/typegen/*-generated.d.ts', 'tests/typegen/generated.d.ts'],
    rules: { 'max-lines': 'off' },
  },
  {
    /** Generated from bounded public API fragments and checked for drift before builds. */
    files: ['src/index.ts'],
    rules: { 'max-lines': 'off' },
  },
  prettier,
);
