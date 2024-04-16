<script setup>
  import ShopMain from './components/ShopMain.vue';
  import ShopHeader from './components/ShopHeader.vue'
  import { ref, provide } from 'vue';
  const scrollEl = ref(null)
  const BarScrollTop = ref("")
  const scroll = (value) => {
    scrollEl.value.setScrollTop(value)
  }
  const getScrollTop = (scrollObj) => {
    BarScrollTop.value = scrollObj.scrollTop
  }
  provide("scroll", scroll)
  provide("BarScrollTop", BarScrollTop)
</script>

<template>
  <el-scrollbar height="100%" wrap-class="wrapEl" ref="scrollEl" @scroll="getScrollTop">
    <div class="layout">
      <shop-header></shop-header>
      <shop-main></shop-main>
    </div>
    <el-backtop target=".wrapEl" :right="100" :bottom="100">
      <el-icon><ArrowUpBold /></el-icon>
    </el-backtop>
  </el-scrollbar>
</template>

<style scoped lang="scss">
  .layout {
    min-height: calc(100vh - 45px);
  }
  .el-backtop {
    --el-backtop-text-color: rgb(156,206,173) !important;
  }
</style>