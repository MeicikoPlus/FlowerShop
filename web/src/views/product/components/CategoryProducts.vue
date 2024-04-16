<script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import ProductItem from '@/components/ProductItem.vue';
  import { findProductsByCategoryApi } from '@/api/product'
  const props = defineProps(['category'])
  const { category } = props
  const router = useRouter()
  const products = reactive([])
  const findProductCategory = () => {
    findProductsByCategoryApi(category).then(res => {
      if (res.code === 1000) {
        products.splice(0, products.length)
        products.push(...res.data.products)
      }
    })
  }
  findProductCategory()
  const goDetail = (id) => {
    router.push({ name: "detail", query: { id } })
  }
</script>

<template>
  <div class="products">
    <h2>{{ category }}</h2>
    <div class="main">
      <product-item 
      v-for="(item, index) in products" 
      :key="index" 
      :product="item"
      @click="goDetail(item.id)"
      ></product-item>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .products {
    margin-bottom: 20px;
    position: relative;
    box-sizing: border-box;
    padding-top: 68px;
    h2 {
      width: 100vw;
      box-sizing: border-box;
      position: absolute;
      left: calc((100vw - 1100px) / -2);
      top: 0;
      padding: 10px 0px;
      text-align: center;
      color: #fff;
      background-color: rgb(156, 206, 173);
    }
    .main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 20px;
      ::v-deep .productItem {
        cursor: pointer;
        width: 29%;
        margin-bottom: 20px;
      }
    }
  }
</style>