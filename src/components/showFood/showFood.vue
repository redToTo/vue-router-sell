<template>
  <transition name="move">
     <div v-show="showFlag" class="showfood" ref="showFlag">
       <div class="showfood-content">
         <div class="image-header">
           <img :src="food.image" alt="">
           <div class="back" @click="hide">
             <i class="icon-arrow_lift"></i>
           </div>
         </div>
         <div class="content">
           <h1 class="title">{{food.name}}</h1>
           <div class="detail">
             <span class="sell-count">月售{{food.sellCount}}份</span>
             <span class="rating">好评率{{food.rating}}%</span>
           </div>
           <div class="price">
             <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.price}}</span>
           </div>
           <div class="cartcontrol-wrapper">
             <cartcontrol :food = "food" @add="Add"></cartcontrol>
           </div>
           <div @click="addfirst" class="buy" v-show="!food.count || food.count===0">
             加入购物车
           </div>
         </div>
         <split v-show="food.info"></split>
         <div class="info" v-show="food.info">
           <h1 class="title">商品信息</h1>
           <p class="text">{{food.info}}</p>
         </div>
         <split></split>
         <div class="rating">
           <h1 class="title"> 商品评价</h1>
           <ratingselect
           :selectType="selectType"
           :onlyContent="onlyContent"
           :desc="desc"
           :ratings="food.ratings"
           @ratingtypeSelect="ratingtypeSelect"
           @contentToggle="contentToggle">
           </ratingselect>
           <div class="rating-wrapper">
             <ul v-show="food.ratings && food.ratings.length">
               <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px" v-for="(rating,index) in food.ratings" :key="index">
                 <div class="user">
                   <span class="name">{{rating.username}}</span>
                   <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                  </div>
                  <!-- 这里formatDate是一个过滤器 -->
                   <div class="time">{{rating.rateTime | formatDate}}</div>
                   <p class="text">
                     <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                     {{rating.text}}
                   </p>
               </li>
             </ul>
             <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
           </div>
         </div>
       </div>
     </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'
  import {formatDate} from '../../common/js/date.js'
  import Vue from 'vue'

  //正向评论
  const POSITIVE = 0
  //负面评价
  const NEGATIVE = 1
  const ALL = 2

  export default{
    props:{
      food:{
        type:Object
      }
    },
    data() {
      return {
        showFlag:false,
        selectType:ALL,
        onlyContent:true,
        desc:{
          all:'全部',
          positive:'推荐',
          negative:'吐槽'
        }
      }
    },
    methods: {
      //设置可以被外部调用的方法，不带有下划线，组件私有的，默认带下划线
      show() {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = true
        this.$nextTick(() => {
          if(!this.scroll){
            this.scroll = new BScroll(this.$refs.showFlag,{
              click:true
            })
          }else{
            this.scroll.refresh()
          }
        })
      },
      hide(){
        this.showFlag = !this.showFlag
      },
      addfirst(){
        this.$emit('add', event.target);
        Vue.set(this.food,'count',1)
      },
      Add(){
        this.$emit('add', event.target);
      },
      needShow(type,text){
        if (this.onlyContent && !text) {
          return false
        } else if(this.selectType === ALL) {
          return true
        }else {
          return type === this.selectType
        }
      },
      ratingtypeSelect(type){
        this.selectType = type
        //因为调用本方法时，Dom尚未更新，所以依旧需要$nextTick方法
        this.$nextTick(()=>{
          this.scroll.refresh()
        })
      },
      contentToggle(only){
        this.onlyContent = only
        this.$nextTick(()=>{
         this.scroll.refresh()
        })
      }
    },
    //在showfood的组件下，调用formatDate的这个filters，再去调用公共的方法，模块化编程
    filters:{
      formatDate(time){
        let date = new Date(time)
        //返回一个在date.js里的formatDate函数
        return formatDate(date,'yyyy-MM-dd hh:mm')
      }
    },
    components:{
      cartcontrol,split,ratingselect
    }
  }
</script>

<style lang="stylus">
  @import '../../common/stylus/mixin.styl'

  .showfood
   position:fixed
   left:0
   top:0
   bottom:48px
   z-index:20
   width:100%
   background:#fff
   .showfood-content
    .image-header
     position:relative
     height:0
     width:100%
     /* 设置padding——top:100%是因为他能够撑开的高度比例是根据当前的width来设定的，使图片能够始终保持正方形 */
     padding-top:100%
     img
      position:absolute
      top:0
      left:0
      width:100%
      height:100%
     .back
      position:absolute
      top:10px
      left:0
      .icon-arrow_lift
       display:block
       padding:10px
       font-size:20px
       color:#fff
    .content
      padding:18px
      position: relative
      .title
       line-height:14px
       margin-bottom:8px
       font-size:14px
       font-weight 700
       color:rgb(7,17,27)
      .detail
       margin-bottom:18px
       line-height:10px
       font-size:0
       height:10px
       .sell-count,.rating
         font-size:10px
         color:rgb(147,153,159)
       .sell-count
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
      bottom:12px
      right:12px
    .buy
      position:absolute
      right:18px
      bottom:18px
      z-index:10
      height:24px
      line-height:24px
      padding:0 12px
      box-sizing:border-box
      font-size:10px
      border-radius:12px
      color:#fff
      background:rgb(0,160,220)
    .info
      padding:18px
      .title
        line-height:14px
        margin-bottom:6px
        font-size:14px
        color:rgb(7,17,27)
      .text
        line-height:24px
        padding 0 8px
        font-size:12px
        color:rgb(77,85,93)
    .rating
      padding-top:18px
      .title
        line-height:14px
        margin-left:18px
        font-size:14px
        color:rgb(7,17,27)
      .rating-wrapper
        padding:0 18px
        .rating-item
          position:relative
          padding:16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position:absolute
            right:0
            top:16px
            font-size:0
            line-height:12px
            .name
              display:inline-block
              margin-right:6px
              vertical-align:top
              font-size:10px
              color:rgb(147,153,159)
            .avatar
              border-radius:50%
          .time
            margin-bottom:6px
            line-height:12px
            font-size:10px
            color:rgb(147,153,159)
          .text
            line-height:16px
            font-size:12px
            color:rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right:4px
              line-height:24px
              font-size:12px
            .icon-thumb_up
              color:rgb(0,160,220)
            .icon-thumb_down
              color:rgb(147,153,159)
        .no-rating
          padding:16px 0
          font-size:12px
          color:rgb(147,153,159)
  .move-enter-active,.move-leave
   transition: all .5s
   transform:translate3d(0,0,0)
  .move-enter,.move-leave-active
   transition: all 0.5s
   transform:translate3d(100%,0,0)
</style>
