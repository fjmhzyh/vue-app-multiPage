'use strict'


const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.conf')
const fs = require('fs');
const glob = require('glob')


const spinner = ora('开始编译打包...')
spinner.start()

rm('./Application', err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  代码编译报错.\n'))
      process.exit(1)
    }

    // 删除所有临时入口文件
    var result = delEntryFile('./source/**/index.js');
    if(!result){
      console.log(chalk.yellow('  删除临时入口文件失败.\n'))
    }

    console.log(chalk.cyan('  代码打包完成.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})



// 删除入口文件
function delEntryFile(globPath) {
  var entries = {};
  var flag = true;

  glob.sync(globPath).forEach(function (file) {
    // console.log('-----------------------------file-------------------', file)
    try{
      fs.unlinkSync(file)
    }catch(err){
      console.log('err', err)
      flag = false;
    }
  });
  return flag;
}
