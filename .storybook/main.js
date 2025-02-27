const path = require('path');

const webpack = require('webpack');

const ringConfig = require('../webpack.config').createConfig();
const pkgConfig = require('../package.json').config;

module.exports = {
  stories: [
    // Make welcome stories default
    '../src/welcome.stories.tsx',
    '../src/**/*.stories.{js,ts,tsx}'
  ],
  addons: [
    '@storybook/addon-storysource',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
        docs: false
      }
    },
    '@storybook/addon-a11y',
    'storybook-addon-themes'
  ],
  webpackFinal(config) {
    ringConfig.componentsPath.push(
      __dirname,
      path.resolve(__dirname, '../src')
    );

    config.module.rules = [
      ...ringConfig.config.module.rules,
      {
        test: /\.md$/,
        loader: 'raw-loader'
      },
      {
        test: /\.stories\.[jt]sx?$/,
        loader: require.resolve('@storybook/source-loader'),
        enforce: 'pre'
      },
      {
        test: /\.svg$/,
        loader: require.resolve('svg-inline-loader'),
        options: {removeSVGTagAttrs: false},
        include: [/@primer\/octicons/, /@jetbrains\/logos/]
      }
    ];

    const serverUri = pkgConfig.hub;
    const clientId = pkgConfig.clientId;
    const hubConfig = JSON.stringify({serverUri, clientId});

    config.plugins.push(new webpack.DefinePlugin({hubConfig}));

    return config;
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  docs: {
    autodocs: false
  },
  staticDirs: ['./custom-header/dist'],
  typescript: {
    reactDocgen: 'react-docgen'
  }
};
