module.exports = {
  root: true,
  extends: '@react-native',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      // Resolve absolute path so ESLint finds the preset even when run from repo root
      presets: [require.resolve('@react-native/babel-preset')],
    },
    ecmaFeatures: {
      jsx: true,
    },
  },
};
