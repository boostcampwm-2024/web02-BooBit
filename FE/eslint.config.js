import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      'plugin:import/errors', // import 관련 오류 체크
      'plugin:import/warnings', // import 관련 경고 체크
      'plugin:jsx-a11y/recommended', // 접근성 관련 규칙
      'plugin:react/recommended', // React 관련 규칙
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
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
      'prettier/prettier': 'error', // Prettier 오류를 ESLint 오류로 처리
      'import/no-unresolved': 'error', // 해결되지 않은 import 오류 체크
      'jsx-a11y/alt-text': 'warn', // 이미지에 대한 alt 속성 경고
      // 필요에 따라 추가적인 규칙을 여기에 설정할 수 있습니다.
    },
  }
);
