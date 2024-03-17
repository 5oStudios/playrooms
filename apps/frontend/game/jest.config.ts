/* eslint-disable */
export default {
  displayName: 'frontend-game',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'ts-jest', // <- note `ts-jest` usage here _not_ `babel-jest`
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/apps/frontend/game',
};
