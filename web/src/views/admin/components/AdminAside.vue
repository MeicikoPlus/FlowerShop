<script setup>
  import { ref, reactive } from 'vue';
  import { dynamicRoutes } from '@/router'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const goHome = () => {
    router.push({ name: "home" })
  }
  const goOption =(name) => {
    router.push({ name })
  }
</script>

<template>
  <div class="aside">
    <div class="option" @click="goHome">返回首页</div>
    <template v-for="(item, index) in dynamicRoutes" :key="index">
      <div class="option" :class="{ 'isActive': route.name === item.children[0].name }" v-if="!item.meta.hidden" @click="goOption(item.children[0].name)">
        {{ item.meta.title }} 
      </div>
    </template>
  </div>
</template>

<style scoped lang='scss'>
  .aside {
    width: 100%;
    height: 100%;
    background-color: rgb(37,37,38);
    .option {
      height: 60px;
      color: #fff;
      line-height: 60px;
      text-align: center;
      cursor: pointer;
    }
    .isActive {
      background-color: rgb(0,102,204);
    }
  }
</style>