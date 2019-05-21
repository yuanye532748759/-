<template>
  
</template>
<script>
import Vue from 'vue'
import $ from 'jquery'
import 'jquery-mousewheel'
import 'malihu-custom-scrollbar-plugin'
import '../assets/css/jquery.mCustomScrollbar.css'

Vue.directive('scroll', {
  bind(el, { value }) {
    Vue.nextTick(() => {
      $(el).mCustomScrollbar({
        mouseWheel: true,
        theme: 'dark',
        callbacks: value
      })
    })
  },
  update(el) {
    $(el).mCustomScrollbar('update')
  }
})
</script>
<style>
.mCSB_inside>div.mCSB_container {
  margin-right: 0;
}

.mCSB_scrollTools .mCSB_dragger div.mCSB_dragger_bar {
  width: 8px;
  margin: 0;
}

.mCSB_scrollTools .mCSB_draggerContainer {
  background: #e0e0e0;
  margin-top: 1px;
}

div.mCSB_scrollTools {
  width: 8px;
}

.mCSB_draggerRail {
  display: none;
}

div.mCS-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,
div.mCS-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar {
  background: #c0c6c8;
}

div.mCS-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar,
div.mCS-dark.mCSB_scrollTools:hover .mCSB_dragger .mCSB_dragger_bar {
  background: #c0c6c8;
}

div.mCSB_scrollTools .mCSB_draggerContainer {
  background: transparent;
}

div.mCSB_scrollTools {
  opacity: 1;
}
</style>