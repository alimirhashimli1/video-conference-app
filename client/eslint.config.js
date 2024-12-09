import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Add this rule to suppress "unused variables" warnings
      '@typescript-eslint/no-unused-vars': [
        'warn', // Change to "off" to disable entirely
        {
          vars: 'all', // Check all variables
          args: 'after-used', // Check only used function arguments
          argsIgnorePattern: '^_', // Ignore variables prefixed with "_"
          varsIgnorePattern: '^_', // Ignore variables prefixed with "_"
        },
      ],
    },
  },
);
