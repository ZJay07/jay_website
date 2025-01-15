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
    // Change max-len to warning instead of error
    'max-len': ['warn', { code: 88 }],
    // Disable the unescaped entities rule
    'react/no-unescaped-entities': 'off',
  },
};
