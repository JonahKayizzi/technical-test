module.exports = {
    '*.{js,jsx,ts,tsx}': [
      'eslint --fix',
      'prettier --write',
      'jest --bail --findRelatedTests',
    ],
    '*.{json,css,md}': ['prettier --write'],
  }