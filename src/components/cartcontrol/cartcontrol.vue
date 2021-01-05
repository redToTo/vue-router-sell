<template>
  <div class="cartcontrol">
    <transition name="move">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart" >
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
  // 通过引入全局的vue，利用全局的Vue.set接口，来添加全局属性
  // 所引入的this.food的count属性就能够被全局观测到
  // 如果不引入，则单一赋值的count在v-show中不生效
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
    },
    methods: {
      addCart() {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
          this.food.count = 1
        } else {
          this.food.count++
        }
        this.$emit('add', event.target)
      },
      decreaseCart() {
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus">
  .cartcontrol
   font-size:0
   .cart-decrease
   /* 为了给用户增加点击区域，通过设置padding来撑开点击区域 */
    display:inline-block
    padding:6px
    .inner
      display:inline-block
      font-size:24px
      color:rgb(0,160,220)
      line-height:24px
      transform: rotate(0)
    /* 利用vue的trantion属性为减号添加动态效果*/
    /* move-enter-active刚刚开始进入动画时 */
    &.move-enter-active
      opacity:1
      transform:translate3D(0,0,0)
      transition:all 0.4s linear
      transform: rotate(180deg)
      /* 动画开始进入过渡时 */
    &.move-enter
      opacity:0
      transform:translate3D(24px,0,0)
      .inner
        transform: rotate(180deg)
      /* 离开动画结束时 */
    &.move-leave-active
      opacity:0
      transform:translate3D(24px,0,0) rotate(180deg)
      transition:all 0.4s linear
   .cart-count
    display:inline-block
    vertical-align:top
    width:12px
    padding-top:6px
    line-height:24px
    text-align:center
    font-size :10px
    color:rgb(147,153,159)
   .cart-add
    display:inline-block
    font-size:24px
    padding: 6px
    line-height:24px
    color:rgb(0,160,220)
</style>
