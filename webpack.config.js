const webpack = require('webpack');
const path = require('path');

const definedPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    DEBUG: JSON.stringify(process.env.DEBUG)
  }
});

const config = {
  resolve: {
    extensions: [
      '.js',
      '.ts'
    ],
    modules: [
      './node_modules'
    ],
    symlinks: true,
    mainFiles: [
      'index'
    ],
    mainFields: [
      'browser',
      'module',
      'main'
    ]
  },
  context: path.resolve(__dirname, 'src/app'),
  entry: './index.ts',
  output: {
    filename: 'main.bundle.min.js',
    path: path.resolve(__dirname, 'assets/script')
  },
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    definedPlugin
  ]
};

module.exports = (env, argv) => { 
  if ('production' === argv.mode) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
}