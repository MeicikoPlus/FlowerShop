<script setup>
  import { ref, reactive } from 'vue';
  import AdminAside from './components/AdminAside.vue';
</script>

<template>
  <div class="admin">
    <div class="left">
      <admin-aside></admin-aside>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .admin {
    height: 100%;
    width: 100%;
    display: flex;
    .left {
      width: 224px;
      min-width: 224px;
      height: 100%;
      background-color: aqua;
    }
    .right {
      height: 100%;
      flex: 1;
    }
  }
</style>