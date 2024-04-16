<script setup>
  import { reactive } from 'vue';
  import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
  import { findProductsByKeywordApi } from '@/api/product.js'
  import ProductItem from '@/components/ProductItem.vue'
  import { ElMessage } from 'element-plus';
  const route = useRoute()
  const router = useRouter()
  let keyword = route.query.keyword
  const products = reactive([])

  const findProductsByKeyword = () => {
    findProductsByKeywordApi(keyword).then(res => {
      if (res.code === 1000) {
        ElMessage({
          type: "success",
          message: res.data.message
        })
        products.splice(0, products.length)
        products.push(...res.data.products)
      }
    }).catch(err => {
      console.log(err || "服务繁忙")
    })
  }
  findProductsByKeyword()

  onBeforeRouteUpdate((to, from, next) => {
    keyword = to.query.keyword
    findProductsByKeyword()
    next()
  })
  const goDetail = (pid) => {
    router.push({ name: "detail", query: { id: pid } })
  }
</script>

<template>
  <div class="search">
    <h2>搜索结果</h2>
    <div class="container">
      <template v-if="products.length > 0">
        <product-item v-for="(item, index) in products" :key="index"
        :product="item"
        @click="goDetail(item.id)"
        ></product-item>
      </template>
      <template v-else>
        <div class="null">
          <el-empty description="暂无商品" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
  .search {
    h2 {
      text-align: center;
      color: #fff;
      padding: 10px 0px;
      background-color: rgb(156, 206, 173);
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      .productItem {
        cursor: pointer;
        margin-bottom: 30px;
        width: 29%;
        transition: all .3s ease;
        &:hover {
          transform: scale(1.05);
        }
      }
      .null {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 20px;
      }
    }
  }
</style>