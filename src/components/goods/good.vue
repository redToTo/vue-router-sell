<template>
  <div>
<div class="goods">
  <div class="menu-wrapper" ref="menuWrapper">
    <ul>
      <li v-for='(item,index) in good' :key='index' class="menu-item" :class="{'current':currentIndex === index}" @click="SelectMenu(index)">
				<span class="text" border-1px>
					<span v-show="item.type>0">
					<support-ico :size=3 :type="item.type"></support-ico>
					</span>
				{{item.name}}
				</span>
      </li>
    </ul>
	</div>
  <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li v-for="(item,index) in good" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="(food,index) in item.foods" :key="index" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="商品图标">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @add="onAdd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
  </div>
  <ShopCart
  ref="shopCart"
  :deliveryPrice="seller.deliveryPrice"
  :minPrice="seller.minPrice"
  :selectFoods="selectFoods">
  </ShopCart>
  <showFood ref="showFood" :food = "selectedFood" @add="onAdd"></showFood>
</div>

</div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { getGoods } from 'api'
  import SupportIco from 'components/support-ico/support-ico.vue'
  import ShopCart from '../shopcart/shopcart.vue'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import showFood from '../showFood/showFood.vue'

  export default {
    name: 'goods',
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        good: [],
        listHeight: [],
        scrollY: 0,
        selectedFood:{}
        }
    },
    created() {
      this.fetch()
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          const height1 = this.listHeight[i]
          const height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      /* 因为在cartcontrol中设置的是全局count属性，所以在这里判断count是否存在即可，
      通过两层foreach（）来遍历fetch()方法范文data.json获取到的good参数，来获取到每个foods数组内的属性，且在遍历右侧商品栏时传了food对象给cartcontrol，使得cartcontrol可以增减count，而在good里又传selectFoods数组给shopcart，shopcart可以通过获取对应商品price以及count来进行计算，进而实现联动 */
      selectFoods() {
        /* 这里的computed监听good属性，good内部由food组成，一旦food.count发生变化，就会进行遍历 */
        const foods = []
        this.good.forEach((go) => {
          go.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
     methods: {
       fetch() {
         getGoods({
           id:this.seller.id
         }).then((res) => {
            this.good = res
/* Vue.nextTick是将回调函数延迟在下一次dom更新数据后调用，简单的理解是：当数据更新了，在dom中渲染后，自动执行该函数 */
            this.$nextTick(() => {
              this._initScroll()
              this._calculateHeight()
            })
         })
       },
       SelectMenu(index) {
/* 有时候切换到pc页面的时候，会触发两次click事件，其原因是因为better-scroll本身会派发一次点击事件，同时加上pc端上点击时候的一次，共有两次
   解决方法是在html标签中@click="SelectMenu(index，$event)" 传入原生点击时会产生的event事件，然后在方法中阻止掉  SelectMenu(index，event)if（！$event._constructed）{return}   */
         const foodlist = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
         const el = foodlist[index]
         this.foodScroll.scrollToElement(el, 300)
       },
       _drop(target) {
         // 体验优化，异步执行下落动画
         this.$nextTick(() => {
            this.$refs.shopCart.drop(target)
         })
       },
       _initScroll() {
         /* BScroll需要传入参数，（dom节点，一个对象Objecet{}） */
         /* 利用better-scroll的一个事件来获取当前纵向移动的y值，监听到scrll事件的时候，能够实时返回y轴数值，类似探针效果 */
         this.menuScroll = new BScroll(this.$refs.menuWrapper, {
           click: true
         })
         this.foodScroll = new BScroll(this.$refs.foodWrapper, {
           probeType: 3,
           click: true
         })
         /* 监听scroll事件,回调函数的参数就是pos */
         this.foodScroll.on('scroll', (pos) => {
           this.scrollY = Math.abs(Math.round(pos.y))
         })
       },
       _calculateHeight() {
         /* getElementsByClassName获取到的是一个伪书组，支持.lenth属性 */
         const foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
         /* 用原生的Dom的clientHeight api拿到当前的区块的高度 */
         let height = 0
         this.listHeight.push(height)
         for (let i = 0; i < foodList.length; i++) {
           /* 因为height是总的高度，所以需要叠加，而不是单个的高度 */
           const item = foodList[i]
           height += item.clientHeight
           this.listHeight.push(height)
         }
       },
       onAdd(target) {
         this._drop(target)
       },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.showFood.show();
      }
     },
     components: {
       SupportIco, ShopCart, cartcontrol,showFood
     }
  }
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/mixin.styl"
  .goods
   position:absolute
   display:flex
   overflow:hidden
   top:174px
   bottom:46px
   width:100%
   .menu-wrapper
   /* 等分 内容不足时候缩放情况 占位空间*/
     flex:0 0 80px
     width:80px
     background:#F3F5F7
     .menu-item
       display:table
       text-align:center
       height:54px
       width:56px
       padding:0 12px
       line-height:14px
       &.current
         position:relative
         margin-top:-1px
         z-index:10
         font-weight:700
         background:#fff
         .text
           border-none()
       .text
         display:table-cell
         vertical-align:middle
         border-1px(rgba(7,17,27,0.1))
         font-size:12px
         width:56px
   .foods-wrapper
    flex:1
    .title
     padding-left:14px
     height:26px
     line-height:26px
     border-left:2px solid#d9dde1
     font-size:12px
     color:rgb(147,153,159)
     background:#f3f5f7
    .food-item
     display:flex
     margin:18px
     padding-bottom:18px
     border-1px(rgba(7,17,27,0.1))
     &:last-child
      border-none()
      margin-bottom:0
     .icon
      flex:0 0 57px
      margin-right:10px
     .content
      flex:1
      .name
       margin:2px 0 8px 0
       height:14px
       line-height:14px
       font-size:14px
       color:rgb(7,17,27)
      .desc,.extra
       line-height:10px
       font-size:10px
       color:rgb(147,153,159)
      .desc
       margin-bottom:8px
       line-height: 13px;
      .extra
       line-height:10px
       .count
         margin-right:12px
      .price
       font-weight:700
       line-height:20px
       .now
        margin-right:18px
        font-size:17px
        color:rgb(240,20,20)
        line-height: 30px;
       .old
        text-decoration:line-through
        font-size:10px
        color:rgb(147,153,159)
      .cartcontrol-wrapper
       position:absolute
       right:0
       bottom:12px
</style>
