module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    // Line length is checked by jlint (strings, comments and URLs are exempt)
    'max-len': 'off',
    // Disable the unescaped entities rule
    'react/no-unescaped-entities': 'off',
  },
};
