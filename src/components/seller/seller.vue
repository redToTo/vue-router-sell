<template>
 <div class="seller" ref="seller">
   <div class="seller-content">
     <div class="overview">
       <h1 class="title">{{seller.name}}</h1>
       <div class="desc border-1px">
         <star :size="36" :score="seller.score"></star>
         <span class="text">({{seller.ratingCount}})</span>
         <span class="text">月售{{seller.sellCount}}单</span>
       </div>
       <ul class="remark">
         <li class="block">
           <h2>起送价</h2>
           <div class="content">
             <span class="stress">{{seller.minPrice}}</span>元
           </div>
         </li>
         <li class="block">
           <h2>商家配送</h2>
           <div class="content">
             <span class="stress">{{seller.deliveryPrice}}</span>元
           </div>
         </li>
         <li class="block">
           <h2>平均配送时间</h2>
           <div class="content">
             <span class="stress">{{seller.deliveryTime}}</span>元
           </div>
         </li>
       </ul>
       <div class="favorite" @click="toggleFavorite">
         <span class="icon-favorite" :class="{'active':favorite}"></span>
         <span class="text">{{favoriteText}}</span>
       </div>
     </div>
     <split></split>
     <div class="bulletin">
       <h1 class="title">公告与活动</h1>
       <div class="content-wrapper border-1px">
         <p class="content">{{seller.bulletin}}</p>
       </div>
       <ul v-if="seller.supports" class="supports">
       				 <li class="supports-item" v-for="(item,index) in seller.supports" :key="index">
          <support-ico class="icon border-1px" :size=4 :type="seller.supports[index].type"></support-ico>
          <span class="text">{{seller.supports[index].description}}</span>
         </li>
       </ul>
     </div>
     <split></split>
     <div class="pics">
       <h1 class="title">商家实景</h1>
       <div class="pic-wrapper" ref="picWrapper">
         <ul class="pic-list" ref="picList">
           <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
             <img :src="pic" width="120" height="90">
           </li>
         </ul>
       </div>
     </div>
     <split></split>
     <div class="info">
       <h1 class="title border-1px">商家信息</h1>
       <ul>
         <li class="info-item" v-for="(info,index) in seller.infos" :key="index">{{info}}</li>
       </ul>
     </div>
   </div>
 </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import SupportIco from 'components/support-ico/support-ico'
  import {saveToLocal,loadFromLocal}from '../../common/js/storage.js'

  const KEY = 'favorite'

  export default {
    name: 'seller',
    props:{
      seller:{
        type:Object
      }
    },
    data(){
      return {
        favorite:false
      }
    },
    computed:{
      favoriteText(){
        return this.favorite?'已收藏':'收藏'//根据favorite是true就返回已收藏，false就返回未收藏
      }
    },
    created() {
      this.favorite = loadFromLocal(this.seller.id,KEY,false)
    },
    watch: {
      'seller'() {
        //为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用 Vue.nextTick(callback)。这样回调函数将在 DOM 更新完成后被调用。
        // 在我们是用router切换页面的时候，只有第一次会对seller进行赋值，而后面再次回到商家页面的时候，是不会触发watch的，所以BScroll也不会被执行初始化
        this.$nextTick(() => {
          this._initScroll()
          this._initPics()
        })
      }
    },
    //不在created中调用BScroll是因为在created钩子中不能确保当前的Dom已经被渲染完成，而bscroll是严重依赖Dom的，所以使用ready钩子，能够确保在Dom完成渲染后进行,但是因为seller是异步获取，当前ready内调用的时候，props的seller尚未获取内容，而页面尚未撑开，所以并未能调用BScroll，但可以用watch观察seller的变化,当前版本的ready已经替换成了mounted
    mounted (){
          // 每次重渲染页面都会调用
          this._initScroll()
          this._initPics()
        },
    methods:{
      _initScroll(){
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPics(){
        if(this.seller.pics){
          // 因为当前的ul宽度等同于pic-wrapper，所以不会生效，而其他竖向滚动的页面，是因为height是通过内容撑开的，远超外部容器的高度，所以我们可以计算ul的宽度
          let picWidth = 120
          let margin = 6
          let width = (picWidth + margin) * this.seller.pics.length-margin
          this.$refs.picList.style.width = `${width}px`
          this.$nextTick(() => {
            if(!this.picScroll){
              this.picScroll = new BScroll(this.$refs.picWrapper,{
                scrollX:true ,//设置横向滚动
                eventPassthrough:'vertical'//进行横向滚动时候，忽略纵向滚动
              })
            }else{
              this.picScroll.refresh();
            }
          })
        }
      },
      toggleFavorite(){
        this.favorite = !this.favorite
        saveToLocal(this.seller.id,KEY,this.favorite)
      }
    },
    components:{
      star,split,SupportIco
    }
  }
</script>

<style lang="stylus">
@import '../../common/stylus/mixin.styl'

  .seller
    position:absolute
    top:174px
    bottom:0
    left:0
    width:100%
    overflow:hidden
    .overview
      padding:18px
      position:relative
      .title
        margin-bottom:8px
        line-height:14px
        color:rgb(7,17,27)
        font-size:14px
      .desc
        padding-bottom:18px
        font-size:0
        border-1px(rgba(7,17,27,0.1))
        .star
          display:inline-block
          vertical-align:top
          margin-right:8px
        .text
           margin-right:12px
           display:inline-block
           line-height:18px
           font-size:10px
           vertical-align:top
           color:rgb(77,85,93)
      .remark
        display:flex
        padding-top:18px
        .block
          flex:1
          text-align:center
          border-right:1px solid rgba(7,17,27,0.1)
          &:last-child
            border:none
          h2
            margin-bottom:4px
            line-height:10px
            font-size:10px
            color:rgb(147,153,159)
          .content
            line-height:24px
            font-size:10px
            color:rgb(7,17,27)
            .stress
              font-size:20px
      .favorite
        position:absolute
        right:18px
        top:18px
        width:36px
        text-align:center
        .icon-favorite
          display:block
          margin-bottom:4px
          line-height:24px
          font-size:24px
          color:#d4d6d9
          &.active
            color:rgb(240,20,20)
        .text
          line-height:10px
          font-size:10px
          color:rgb(77,85,93)
    .bulletin
      padding:18px 18px 0 18px
      .title
        margin-bottom:8px
        line-height:14px
        color:rgb(7,17,27)
        font-size:14px
      .content-wrapper
        padding:0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height:24px
          font-size:12px
          color:rgb(240,20,20)
      .supports
        .supports-item
          padding:16px 12px
          border-1px(rgba(7,17,27,0.1))
          font-size:0
          &:last-child
            border-none()
        .icon
          display:inline-block
          width:16px
          height:16px
          vertical-align:top
          margin-right:16px
          background-size:16px 16px
          background-repeat:no-repeat
        .text
          line-height:16px
          font-size:12px
          color:rgb(7,17,27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        /* 图片超过宽度时不会被折行 */
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 14px
      .info-item
        padding: 16px 12px
        line-height: 16px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
        &:last-child
          border-none()
</style>
