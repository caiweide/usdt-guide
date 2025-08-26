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

// init timestamp in YYYYMMDDHHMM format
var now = new Date();
var timestamp = now.getFullYear().toString() +
  (now.getMonth() + 1).toString().padStart(2, '0') +
  now.getDate().toString().padStart(2, '0') +
  now.getHours().toString().padStart(2, '0') +
  now.getMinutes().toString().padStart(2, '0');

// Helper function to generate flattened filename with path info
function generateFlattenedFilename(pathData, basePath = 'images') {
  const relativePath = path.relative('src', pathData.filename);
  const parsedPath = path.parse(relativePath);

  // Extract the directory path and convert to filename-friendly format
  const dirPath = parsedPath.dir.replace(/\\/g, '/'); // normalize separators
  const pathParts = dirPath.split('/').filter(part => part !== ''); // remove empty parts

  // Remove redundant parts: 'assets', 'images' from the path
  const filteredParts = pathParts.filter(part =>
    part !== 'assets' && part !== 'images'
  );

  // Create the filename: path parts + basename + timestamp + extension
  const pathString = filteredParts.length > 0 ? filteredParts.join('-') + '-' : '';
  const filename = `${pathString}${parsedPath.name}-${timestamp}${parsedPath.ext}`;

  return `${basePath}/${filename}`;
}

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
      // for images - flattened with path in filename
      {
        test: /\.(png|jpg|webp|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: (pathData) => generateFlattenedFilename(pathData, 'images')
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
      // for mp4 - flattened with path in filename
      {
        test: /\.mp4$/i,
        type: 'asset/resource',
        generator: {
          filename: (pathData) => generateFlattenedFilename(pathData, 'videos')
        }
      },
    ],
  },
  plugins: [
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