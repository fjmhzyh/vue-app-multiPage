'use strict'
// 引入node模块
const path = require('path');
const fs = require('fs');

// 第三方插件
const chalk = require('chalk')
const glob = require('glob');

// 引入webpack插件
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PreloadPlugin = require('preload-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin')


const globPath = './pages/**/app.vue';

const globOptions = {
  // cwd : __dirname+ '/..',
  // root :process.cwd(),
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


// webpack配置
const devWebpackConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {},
  output: {
    path: 'temp', 
    // publicPath: '/Public/',                
    filename: '[name].[hash:8].js',         
    // chunkFilename:'[id].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js' //完整版本的vue
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        "use": [
          {
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2,
              modules: false,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          /* config.module.rule('images').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'public/img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          /* config.module.rule('svg').use('file-loader') */
          {
            loader: 'file-loader',
            options: {
              name: 'publicimg/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          /* config.module.rule('media').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'public/media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          /* config.module.rule('fonts').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'public/fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      // {
      //   enforce: 'pre',
      //   // test: /\.(js|vue)$/,
      //   test: /\.vue$/,
      //   loader: 'eslint-loader',
      //   // include: [resolve('pages'),resolve('source')],
      //   exclude: /node_modules/,
      //   options: {
      //     formatter: require('eslint-friendly-formatter'),
      //     emitWarning: true
      //   }
      // }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      // 'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    // HMR shows correct file names in console on update.
    new webpack.NamedModulesPlugin(), 
    new webpack.NoEmitOnErrorsPlugin(),
    /* config.plugin('preload') */
    new PreloadPlugin(
      {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [
          /\.map$/,
          /hot-update\.js$/
        ]
      }
    ),
    /* config.plugin('prefetch') */
    new PreloadPlugin(
      {
        rel: 'prefetch',
        include: 'asyncChunks'
      }
    ),
    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: './dist/',
    //     ignore: ['.*']
    //   }
    // ])
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors/vendors',
          chunks: 'all',
          minChunks:2, 
          // minSize: 0,  
        }
      }
    },
    minimizer : [
      // 压缩js
      new TerserPlugin({ 
        cache: true,
        parallel: true
      }),
      // 压缩css
      new OptimizeCSSAssetsPlugin({ 
        cssProcessorOptions: {
          safe: true
        }
      })
    ]
  },
  performance: {
    hints: "warning", // 枚举
    maxAssetSize: 30000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  watch: true,
  devServer: {
    writeToDisk: true,
    clientLogLevel: 'warning',
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: '127.0.0.1',
    open: true,
    openPage: 'temp/app.html',
    overlay:  { warnings: true, errors: true },
    proxy: {},
    quiet: true, // necessary for FriendlyErrorsPlugin
    // watch: true
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
}


// 根据每个app.vue, 自动生成入口文件
genEntry(); 
//  根据每个app.vue, 自动生成HTML模板
genPages();


// 自动生成入口文件
function genEntry() {
  var entries = {};

  glob.sync(globPath, globOptions).forEach(function (entry) {
    console.log('entry', entry)
    // 去掉路径的前缀和文件名
    // 比如 entry ="./source/test/index.js", 则 str = test
    // 生成的name将并作为打包后 js文件的路径
    var str = entry.substring(entry.indexOf('/',2)+1,entry.lastIndexOf('/'))
    var arr = str.split('/')
    var name = `${str}/${arr[arr.length-1]}`
    if(str == '/'){
      name = 'app'
      // console.log(chalk.red(
      //   '  --------------------------------------------------------------------.\n\n'+
      //   '  警告: 请用文件夹包裹文件, 不要直接放在pages根目录中!!!\n\n' +
      //   '  --------------------------------------------------------------------..\n'
      // ))
    }
    // 生成打包入口文件
    var file = copyFile(entry);
    // 生成webpack入口配置
    entries[name] = file;
  });
  devWebpackConfig.entry = entries;
}

// 自动生成HTML模板文件
function genPages() {
  var pages = {};
  glob.sync(globPath, globOptions).forEach(function (entry) {
    // console.log('entry-++++++++++++++++++++++++++++++++++', entry)
    let file = entry.replace('app.vue','index.html')
    // pathname = file.split('/').splice(-3, 2).join('/'); 

    // 去掉路径的前缀和文件名
    // 比如 entry ="./source/test/index.js", 则 str = test
    // 生成的name将并作为打包后 js文件的路径
    var str = entry.substring(entry.indexOf('/',2)+1,entry.lastIndexOf('/'))
    var arr = str.split('/')
    var name = `${str}/${arr[arr.length-1]}`
    if(str == '/'){
      name = 'app'
    }
    pages[name] = file.split('../pages')[1];
  });

  // 循环添加HTML页面
  for (var pathname in pages) {
    var conf = {
      filename: './temp/'+pathname + '.html',  // html 文件输出路径
      // template: pages[pathname], // 模板路径
      template: './template.html', // 模板路径
      inject: true,              // js 插入位置
      minify: {
        removeComments: true,
        collapseWhitespace: false
      },
      // chunks: ['vendors', pathname],
      // hash: false
    };
    // chunks:：引入的模块，这里指定的是entry中设置多个js时，在这里指定引入的js，如果不设置则默认全部引入
    // hash：是否生成hash添加在引入文件地址的末尾，这个可以避免缓存带来的麻烦。默认为true
    if (pathname in devWebpackConfig.entry) {
      conf.chunks = ['vendors/vendors', pathname];
      // console.log('-----------------conf.chunks-----------------', conf.chunks)
      conf.hash = false;
    }
    devWebpackConfig.plugins.unshift(new HtmlWebpackPlugin(conf));
  }
}

// 复制文件
function copyFile(path){
  let dest = path.replace('app.vue','index.js')
  console.log('------------------------------------dest------------------------------------', dest);
  console.log('-------------------------文件是否存在----------------------------', fs.existsSync(dest))
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(resolve('template.js'), dest);
  }
  return dest
}

// 导出配置文件
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT?process.env.PORT:5000;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        // onErrors: createNotifierCallback()
      }))

      resolve(devWebpackConfig)
    }
  })
})




function createNotifierCallback() {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    console.log(error.webpackError)

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

