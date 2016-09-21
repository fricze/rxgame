var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  context: __dirname,

  entry: {
    main: './main'
  },

  devtool: 'source-map',

  output: {
    path: path.resolve('./bundles/'),
    publicPath: '/bundles/',
    filename: '[name].js'
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.optimize.DedupePlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|gif)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },

  resolve: {
    root: path.resolve(__dirname),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.css']
  }
}
