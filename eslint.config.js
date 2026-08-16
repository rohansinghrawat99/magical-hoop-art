import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'design-reference', 'node_modules'] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // The design's copy contains typographic characters (·, —, ♥) by intent.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Literal[value=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/]:not([parent.type='ImportDeclaration'])",
          message:
            'Raw hex colours are not allowed. Use a design token from src/styles/index.css. See docs/DESIGN_SYSTEM.md.',
        },
        {
          // Joining class lists with `+` is silently destructive: Prettier
          // reflows the operands and can eat the boundary space, fusing
          // `rounded-[22px] ` + `border` into the invalid `rounded-[22px]border`.
          // This shipped three broken class lists before it was caught.
          // Use an array of strings instead — cva and cn() both accept one.
          selector:
            "BinaryExpression[operator='+'] > Literal[value=/(?:^|\\s)(?:flex|grid|hidden|absolute|relative|fixed|sticky|w-|h-|p-|px-|py-|m-|mt-|mb-|gap-|text-|bg-|border|rounded|shadow|transition|duration|ease-|animate-|hover:|focus:|active:|inset-|top-|left-|right-|bottom-|z-|overflow-|tracking-|leading-|uppercase|min-|max-|size-)/]",
          message:
            'Do not join Tailwind class lists with `+`. Prettier can drop the space between operands and silently fuse two classes into an invalid one. Use an array of strings — both cva() and cn() accept one.',
        },
        {
          // Tailwind v4 compiles `-translate-y-*` / `scale-*` to the standalone
          // `translate` / `scale` CSS properties, NOT to `transform`. A list
          // naming `transform` without `translate` leaves the lift
          // untransitioned: the element snaps on the first frame while the
          // shadow eases in behind it. No frames drop, so profiling finds
          // nothing. This shipped in three components.
          selector:
            'Literal[value=/transition-\\[[^\\]]*transform[^\\]]*\\]/]:not([value=/transition-\\[[^\\]]*translate/])',
          message:
            'A `transition-[...transform...]` list will NOT animate `-translate-y-*` in Tailwind v4 — that utility sets the standalone `translate` property. Use LIFT from @/lib/motion, or add `translate` to the list.',
        },
      ],
    },
  },

  // Layer boundary: ui/ primitives are generic and must not know about content.
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/constants/*', '@/data/*', '../../../features/*'],
              message:
                'ui/ primitives must stay content-agnostic. Pass data in via props instead. See docs/ARCHITECTURE.md.',
            },
          ],
        },
      ],
    },
  },

  // Radix is an implementation detail of ui/ — feature code composes our primitives.
  {
    files: ['src/features/**/*.{ts,tsx}', 'src/components/layout/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@radix-ui/*'],
              message:
                'Import the wrapper from @/components/ui instead, so the underlying primitive stays swappable. See docs/ARCHITECTURE.md.',
            },
          ],
        },
      ],
    },
  },

  // The petal generator is a faithful port of the design's inline-style output.
  {
    files: ['src/lib/petals.ts', 'src/styles/**'],
    rules: { 'no-restricted-syntax': 'off' },
  },

  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },

  {
    files: ['scripts/**/*.mjs', '*.config.{js,ts}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
);
