<template>
  <div class="shopcart">
    <div class="content"  @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight' : totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight' : totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">
            {{totalCount}}
          </div>
        </div>
        <div class="price" :class="{'highlight' : totalPrice > 0}">￥{{totalPrice}}元</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <!-- .stop.prevent阻止冒泡，点击支付不会影响别的事件 -->
        <div class="pay" :class="payClass" @click.stop.prevent="pay">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="(ball,index) in balls" :key="index">
         <transition
         name="drop"
         @before-enter="beforeDrop"
         @enter="dropping"
         @after-enter="afterDrop"
         >
        <div  class="ball" v-show="ball.show">
        <div class="inner inner-hook"></div>
        </div>
         </transition>
      </div>
    </div>
    <transition name="fold">
    <div class="shopcart-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" ref="listContent">
        <ul>
          <li class="food" v-for="(food,index) in selectFoods" :key="index">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>￥{{food.price*food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food" @add="addFood"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </transition>
    <transition  name="fade">
      <div class="list-mask"  v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import BScroll from 'better-scroll'

  const BALL_LEN = 10
  function createBalls() {
    const balls = []
    for (let i = 0; i < BALL_LEN; i++) {
      balls.push({ show: false })
    }
    return balls
  }

  export default {
    name: 'shopcart',
    data() {
      return {
        balls: createBalls(),
        dropBalls: [],
        fold: true,
        listShow: false
      }
    },
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
        },
        minPrice: {
          type: Number,
          default: 0
        }
    },
    computed: {
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount() {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < 20) {
          const diff = this.minPrice - this.totalPrice
          return `还差${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }/* ,
      //因为vue2.0中不支持在计算机属性中直接修改，所以有以下两种解决方法，1.是在computed中设置get和set方法。2.是将listShow抽出来放到watch里，监听fold值的变化，来触发
      listShow: {
        get: function () {
          return this.fold
        },
        set: function () {
          if (!this.totalCount) {
            this.fold = true
            return false
          }
          const show = !this.fold
          return show
        }
       } */
    },
    watch: {
       fold: function() {
          if (!this.totalCount) {
            this.fold = true
            this.listShow = false
          } else {
            const show = !this.fold
            this.listShow = show
            if (show) {
              this.$nextTick(() => {
                if (!this.scroll) {
                  // 引入betterscroll插件，使购物车列表能够滑动，并且使用nextTick方法，避免dom还未进行渲染时进行调用
                this.scroll = new BScroll(this.$refs.listContent, {
                  click: true
                })
                } else {
                  // 调用scroll的refresh方法，自动匹配当前视口和组件的高度差，决定是否要滚动
                  this.scroll.refresh()
                }
              })
            }
          }
         }
    },
    methods: {
        drop(el) {
          for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i]
            if (!ball.show) {
              ball.show = true
              ball.el = el
              this.dropBalls.push(ball)
              return
            }
          }
        },
        addFood(target) {
          this.drop(target);
        },
        // div标签中的名字是drop，通过el访问Dom，el就是Dom节点
          // 动画小球下落前
        beforeDrop (el) {
          let count = this.balls.length
          // 当count--不为0的时候
          while (count--) {
            const ball = this.balls[count]
            if (ball.show) {
              // getBoundingClientRect()用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
              const rect = ball.el.getBoundingClientRect()
              // 横轴位置 = 当前点击位置距离左侧的距离 - 小球左侧偏移的值
              const x = rect.left - 32
              // 纵轴位置 = -（当前窗口的高度-当前点击位置距离顶部的距离-小球bottom位移的值）
              // 因为结果是负值，所以要取反
              const y = -(window.innerHeight - rect.top - 22)
              el.style.display = ''
              // 让外层的元素做纵向的变化
              el.style.webkitTransform = `translate3d(0,${y}px,0)`
              el.style.transform = `translate3d(0,${y}px,0)`
              // 获取内部的inner元素，使其做横向变化，
              const inner = el.getElementsByClassName('inner-hook')[0]
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`
              inner.style.transform = `translate3d(${x}px,0,0)`
            }
          }
          },
         // 动画小球下落时
        dropping (el) {
             // 触发浏览器重绘,因为定义的rf重绘变量不使用，所以要跳过eslint检测
             /* eslint-disable no-unused-vars */
             this._reflow = document.body.offsetHeight
             this.$nextTick(() => {
               el.style.webkitTransform = 'translate3d(0,0,0)'
               el.style.transform = 'translate3d(0,0,0)'
               // 获取内部的inner元素，使其做横向变化，
               const inner = el.getElementsByClassName('inner-hook')[0]
               inner.style.webkitTransform = 'translate3d(0,0,0)'
               inner.style.transform = 'translate3d(0,0,0)'
             })
        },
        // 动画小球下落后
        afterDrop (el) {
          // 用shift方法，删除并返回dropBalls中的第一个元素
          const ball = this.dropBalls.shift()
          // 重置ball.show属性为false
          if (ball) {
            ball.show = false
            el.style.display = 'none'
          }
        },
        toggleList() {
          // 如果购物车为空，则退出
          if (!this.totalCount) {
            return
          }
          // 此时购物车不为空，点击购物车组件，设置fold为之前的相反值
          this.fold = !this.fold
              },
        empty() {
          this.selectFoods.forEach((food) => {
            food.count = 0
          })
          this.fold = true
          this.listShow = false
        },
        hideList(){
          this.fold = true
        },
        pay() {
          if (this.totalPrice < this.minPrice) {
            return;
          }
          window.alert(`支付${this.totalPrice}元`);
        },
           },
    components: {
       cartcontrol
     }
  }
</script>

<style lang="stylus">
@import "../../common/stylus/mixin.styl"
  .shopcart
   position:fixed
   left:0
   bottom:0
   z-index:50
   width:100%
   height:48px
   background:#000
   .content
     display:flex
     background:#141d27
     font-size:0
     color:rgba(255,255,255,0.4)
     .content-left
      flex:1
      .logo-wrapper
       display:inline-block
       position:relative
       box-sizing:border-box
       vertical-align:top
       border-radius:50%
       top:-10px
       margin:0 12px
       padding:6px
       width: 56px
       height:56px
       background:#141d27
       .logo
        width:100%
        border-radius:50%
        text-align:center
        background:#2b343c
        &.highlight
         background:rgb(0,160,220)
        .icon-shopping_cart
         font-size:24px
         line-height:44px
         color:#80858a
         &.highlight
          color:#fff
       .num
         position:absolute
         top:0
         right:0
         width:24px
         height:16px
         line-height:16px
         text-align:center
         border-radius:16px
         font-size:9px
         color:#fff
         font-weight:700
         background:rgb(240,20,20)
         box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
      .price
       display:inline-block
       vertical-align:top
       line-height:24px
       margin-top:12px
       padding-right:12px
       box-sizing:border-box
       border-right:1px solid rgba(255,255,255,0.1)
       font-size:16px
       font-weight:700
       &.highlight
        color:#fff
      .desc
       display:inline-block
       vertical-align:top
       line-height:24px
       margin:12px 0 0 12px
       font-size:10px
     .content-right
      flex:0 0 105px
      width:105px
      .pay
       height:48px
       line-height:48px
       text-align:center
       font-size:12px
       font-weight:700
       background:#2b333b
       &.not-enough
        background:#2b333b
       &.enough
        background:#00b43c
        color:#fff
   .ball-container
     .ball
      position:fixed
      left:32px
      bottom:22px
      z-index:200
      /* 外层动画，纵轴变化设定（cubic-bezier贝塞尔曲线设定） */
      transition:all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
       width:16px
       height:16px
       border-radius:50%
       background:rgb(0,160,220)
       /* 内层动画，横轴变化设定 */
       transition:all 0.4s linear
   .shopcart-list
     position:fixed
     left:0
     bottom:46px
     z-index:-1
     width:100%
     .list-header
       height:40px
       line-height:40px
       padding:0 18px
       background:#f3f5f7
       border-bottom:1px solid rgba(7,17,27,0.1)
       .title
         float:left
         font-size:14px
         color:rgb(7,17,27)
       .empty
         float:right
         font-size:12px
         color:rgb(0,160,220)
     .list-content
       padding:0 18px
       max-height:180px
       overflow:hidden
       background:#fff
       .food
        position:relative
        padding:12px 0
        box-sizing:border-box
        border-1px(rgba(7,17,27,0.1))
        .name
         line-height:24px
         font-size:14px
         color:rgb(7,17,27)
        .price
         position:absolute
         right:90px
         bottom:12px
         line-height:24px
         font-size:14px
         font-weight:700
         color:rgb(240,20,20)
        .cartcontrol-wrapper
         position:absolute
         right:0
         bottom:6px
   .fold-enter-active
     transition: all .5s
   .fold-leave-active
     transition: all .5s
   .fold-enter, .fold-leave-to
     transform: translateY(100%)
  .list-mask
   position:fixed
   top:0
   width:100%
   height:100%
   z-index:-20
   backdrop-filter: blur(10px);
   background:rgba(7,17,27,0.6)
   opacity:1
   &.fade-enter-active, &.fade-leave-active
     transition: all 0.5s
   &.fade-enter, &.fade-leave-active
     opacity: 0
     background: rgba(7, 17, 27, 0)
</style>
