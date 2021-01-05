<template>
  <div class="ratingselcet">
    <div class="rating-type" border-1px>
      <span @click="select(2)" class="block positive" :class="{'active':selectTypes===2}">
      {{desc.all}}
      <span class="count">{{ratings.length}}</span>
      </span>
      <span @click="select(0)" class="block positive" :class="{'active':selectTypes===0}">
      {{desc.positive}}
      <span class="count">{{positive.length}}</span>
      </span>
      <span @click="select(1)" class="block negative" :class="{'active':selectTypes===1}">
      {{desc.negative}}
      <span class="count">{{negative.length}}</span>
      </span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContents === true}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  //正向评论
  const POSITIVE = 0
  //负面评价
  const NEGATIVE = 1
  const ALL = 2
  export default{
    props:{
      ratings:{
        type:Array,
        default(){
          return []
        }
      },
      selectType:{
        type:Number,
        default:ALL
      },
      onlyContent:{
        type:Boolean,
        default:false
      },
      desc:{
        type:Object,
        default(){
          return{
            all:'全部',
            positive:'满意',
            negative:'不满意'
          }
        }
      }
    },
    data(){
      return {
        selectTypes:[],
        onlyContents:false
      }
    },
    computed:{
      //利用数组filter方法来过滤出ratings中为0和1的内容，然后分别形成新的数组
      positive(){
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negative(){
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    created() {
      //因为在2.0后，prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是不会反过来。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解。直接修改props传过来的selectType，会报错，所以需要创建一个副本，存放selectType，然后修改这个副本selectTypes即可
      this.selectTypes = this.selectType
      this.onlyContents = this.onlyContent
    },
    methods:{
      select(type){
        this.selectTypes = type
        this.$emit('ratingtypeSelect',type)
      },
      toggleContent(){
        this.onlyContents = !this.onlyContents
        this.$emit('contentToggle',this.onlyContents)
      }
    }
  }
</script>

<style lang="stylus">
  @import "../../common/stylus/mixin.styl"

    .ratingselcet
     .rating-type
       padding:18px 0
       margin:0 18px
       border-1px(rgba(7,17,27,0.1))
       font-size:0
       .block
         display:inline-block
         padding:8px 12px
         margin-right:8px
         line-height:16px
         border-radius:1px
         color:rgb(77,85,93)
         font-size:12px
         &.active
           color:#fff
         .count
           font-size:8px
           margin-left:2px
         &.positive
           background:rgba(0,160,220,0.2)
           &.active
            background:rgba(0,160,220,1)
         &.negative
           background:rgba(77,85,93,0.2)
           &.active
             background:rgba(77,85,93,1)
     .switch
       padding:12px 18px
       line-height:24px
       border-bottom:1px solid rgba(7,17,27,0.1)
       color:rgb(147,153,159)
       font-size:0
       &.on
         .icon-check_circle
           color:#00c850
       .icon-check_circle
         display:inline-block
         vertical-align:top
         margin-right:4px
         font-size:24px
       .text
         font-size:12px
</style>
