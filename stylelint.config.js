module.exports = {
  root: true,
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  rules: {
    'comment-no-empty': true, // 禁止空注释
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};
