const appData = require('./data.json')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings
const path = require('path')

// 拼接地址__dirname：当前根目录的地址
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    lintOnSave: false,
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    hot: true,
    inline: true, // 关闭热更新
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },
  devServer: {
    before (app) {
      app.get('/api/seller', function (req, res) {
        // 获取请求中的id,然后拼接在了,获取返回到的seller中,使我们能根据这个id进行判断
        const id = req.query.id
        res.json({
          errno: 0,
          data: Object.assign({},seller,{id})
        })
      })
      app.get('/api/goods', function (req, res) {
        res.json({
          errno: 0,
          data: goods
        })
      })
      app.get('/api/ratings', function (req, res) {
        res.json({
          errno: 0,
          data: ratings
        })
      })
    }
  },
  chainWebpack (config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
  }
}
