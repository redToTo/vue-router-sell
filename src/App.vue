<template>
<div id="app">
<Vheader :seller="seller"></Vheader>
  <Tab></Tab>
  <keep-alive>
      <router-view :seller="seller"></router-view>
  </keep-alive>
</div>
</template>
<script>
import Vheader from 'components/v-header/v-header.vue'
import { getSeller } from 'api'
import Tab from 'components/tab/tab.vue'
import qs from 'query-string'

export default {
  name: 'app',
  data () {
    return {
      seller: {
        // qs.parse()将URL解析成对象的形式,获取当前的访问id
        // 参考链接：https://blog.csdn.net/weixin_42752574/article/details/103109098
        // 此处应当注意，url中因为vue-router 默认 hash 模式，带有#，但是，search只能在取到“？”后面和“#”之前的内容，如果“#”之前没有“？”search取值为空。它默认参数和#是一个字符串，因此在main.js中将vue-router模式修改为history模式
        id:qs.parse(window.location.search).id
      }
    }
  },
  created () {
    this._getSeller()
  },
  methods: {
    _getSeller () {
      getSeller({
        id:this.seller.id
      }).then((res) => {
        // 此时的this.seller是没有id的,因为是从后台返回来的data中没有id属性,可以在这动态拼接,也可以在vue.config.js中拼接
        this.seller = res
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  components: {
    Vheader, Tab
  }
}
</script>
<style lang="stylus">
</style>
