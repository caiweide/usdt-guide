var path = require('path');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// Look for .html files
var htmlFiles = [];
var directories = ['src'];
while (directories.length > 0) {
  var directory = directories.pop();
  var dirContents = fs.readdirSync(directory)
    .map(file => path.join(directory, file));
  htmlFiles.push(...dirContents.filter(file => file.endsWith('.html')));

  directories.push(...dirContents.filter(file => fs.statSync(file).isDirectory()));
}

// init timestamp
var timestamp = Date.now();

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ['html-loader'],
      },
      // for images
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   type: 'asset/resource',
      //   loader: 'image-webpack-loader',
      //   options: {
      //     disable: true
      //   },
      //   generator: {
      //     filename: `images/[name]-[hash]${timestamp}[ext]`
      //   },
      // },
      // for images
      {
        test: /\.(png|jpg|webp|gif)$/i,
        type: 'asset/resource',
        // use: [{
        //   loader: 'image-webpack-loader',
        //   options: {
        //     mozjpeg: {
        //       quality: 85,
        //     },
        //     // pngquant: {
        //     //   quality: [.90, .95],
        //     // },
        //   }
        // }],
        // parser: {
        //   dataUrlCondition: {
        //     maxSize: 10 * 1024 // 10kb
        //   }
        // },
        generator: {
          filename: `images/[name]-[hash]${timestamp}[ext]`
        }
      },
      // for css
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'url-loader'],
        generator: {
          filename: 'css/[name]-[hash][ext]'
        },
      },
      // for javascript
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
        generator: {
          filename: 'js/[name][ext]'
        }
      },
      // for mp4
      {
        test: /\.mp4$/i,
        type: 'asset/resource',
        generator: {
          // filename: 'videos/[name]-[hash][ext]'
          filename: `videos/[name]-[hash]${timestamp}[ext]`
        }
      },
    ],
  },
  plugins: [
    // Build a new plugin instance for each .html file found
    new MiniCssExtractPlugin(),
    ...htmlFiles.map(htmlFile =>
      new HtmlWebpackPlugin({
        template: htmlFile,
        filename: htmlFile.replace(path.normalize("src/"), ""),
        chunks: [htmlFile],
        inject: false,
      })
    )
  ],
};
