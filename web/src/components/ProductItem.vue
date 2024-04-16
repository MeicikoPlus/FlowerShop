<script setup>
  const props = defineProps(['product'])
  const { product } = props
</script>

<template>
  <div class="productItem">
    <el-image :src="`http://127.0.0.1:3000/flower/${product.product_image}`" lazy></el-image>
    <div class="top">
      <h4>{{ product.product_name }}</h4>
      <h5>{{ product.product_category }}</h5>
    </div>
    <p>{{ product.product_description }}</p>
    <p class="price">¥ {{ (product.product_price * product.product_discount).toFixed(2) }}</p>
    <span class="num">剩余{{ product.product_number }}+ 件商品</span>
  </div>
</template>

<style scoped lang="scss">
  .productItem {
    padding: 12px 12px 30px 12px;
    border-radius: 6px;
    box-shadow: var(--el-box-shadow-light);
    overflow: hidden;
    position: relative;
    .top {
      position: relative;
      margin-bottom: 10px;
    }
    ::v-deep .el-image {
      width: 100%;
      min-width: 300px;
      height: 300px;
      border-radius: 6px;
      margin-bottom: 6px;
    }
    h4 {
      margin-bottom: 6px;
      font-weight: 500;
      font-size: 18px;
    }
    h5 {
      position: absolute;
      bottom: 0px;
      font-size: 12px;
      padding: 3px;
      color: rgb(156, 206, 173);
      border: 1px solid rgb(156, 206, 173);
      right: 10px;
    }
    p {
      width: 95%;
      font-size: 13px;
      height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .price {
      color: red;
      font-size: 15px;
      font-weight: 600;
    }
    .num {
      position: absolute;
      bottom: 10px;
      right: 10px;
      color: rgba(190, 190, 190);
      font-size: 12px;
    }
  }
</style>