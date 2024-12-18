import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // 사용 중인 확장자를 모두 추가
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      react: react,
      prettier,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error', // Hook 사용 규칙 체크
      'react-hooks/exhaustive-deps': 'warn', // Hook의 의존성 배열 체크
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // React Refresh에서 컴포넌트만 내보내도록 경고
      ],
      'import/no-unresolved': 'error', // 해결되지 않은 import 오류 체크
      'prettier/prettier': ['error', { endOfLine: 'auto' }], // Prettier 오류를 ESLint 오류로 처리
      'jsx-a11y/alt-text': 'warn',
    },
  }
);
