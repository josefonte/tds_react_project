module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
  plugins: [['@babel/plugin-proposal-decorators', {legacy: true}]],
};
