import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist', 'build'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.strict, ...tseslint.configs.stylistic],
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.browser,
        },
        rules: {
            camelcase: 'error',
        },
    }
);
