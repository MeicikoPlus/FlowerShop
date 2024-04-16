<script setup>
  import { findProductByIdApi, findProductsByCategoryApi } from '@/api/product.js'
  import ProductItem from '@/components/ProductItem.vue'
  import { useUserStore } from '@/store/userStore.js'
  import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
  import { ref, reactive, toRefs, inject } from 'vue'
  import { useCartStore } from '@/store/cartStore.js'
  const cartStore = useCartStore()
  const scroll = inject("scroll")
  const router = useRouter()
  const route = useRoute()
  const product_id = ref(route.query.id)
  const product_info = reactive({})
  const product_category = ref("")
  const otherProducts = reactive([])
  const num = ref(1)
  const userStore = useUserStore()
  const { userinfo } = toRefs(userStore)
  scroll(0)
  const findProductById = () => {
    return new Promise((resolve, reject) => {
      findProductByIdApi(product_id.value).then(res => {
        if (res.code === 1000) {
          Object.assign(product_info, {})
          Object.assign(product_info, res.data.product)
          resolve(res.data.product)
        } else {
          reject()
        }
      }).catch(err => {
        console.log("error:", err || "服务繁忙")
        reject(err)
      })
    })
  }
  const toolFun = () => {
    findProductById().then(res => {
      product_category.value = res.product_category
      findProductsByCategoryApi(product_category.value).then(res => {
        if (res.code === 1000) {
          otherProducts.splice(0, otherProducts.length)
          otherProducts.push(...res.data.products)
        }
      }).catch(err => {
          console.log("error:", err || "服务繁忙")
      })
    })
  }
  toolFun()

  const addCartClick = () => {
    const uid = userinfo.value.uid
    const data = {
      uid,
      quantity: num.value,
      product_id: product_info.id,
      product_name: product_info.product_name,
      product_image: product_info.product_image,
      price: (product_info.product_price * product_info.product_discount).toFixed(2)
    }
    cartStore.addCart(data)
  }
  const goDetail = (pid) => {
    router.push({ name: "detail", query: { id: pid } })
  }
  onBeforeRouteUpdate((to, from, next) => {
    scroll(0)
    product_id.value = to.query.id
    toolFun()
    next()
  })
</script>

<template>
  <div class="container product">
    <div class="left">
      <el-image :src="`http://127.0.0.1:3000/flower/${product_info.product_image}`" lazy></el-image>
    </div>
    <div class="right">
      <h2 class="name">{{ product_info.product_name }}</h2>
      <p class="category">{{ product_info.product_category }}</p>
      <p class="description">{{ product_info.product_description }}</p>
      <p class="price">{{ (product_info.product_price * product_info.product_discount).toFixed(2) }}元
        <span>{{ product_info.product_discount * 10 }}折</span>
      </p><br>
      <el-input-number v-model="num" /><br />
      <el-button type="success" @click="addCartClick">加入购物车</el-button>
    </div>
  </div>
  <h2 class="recommend"><em>相似商品</em></h2>
  <div class="container products">
    <template v-if="otherProducts.length > 0">
      <product-item v-for="(item, index) in otherProducts" :key="index" :product="item" @click="goDetail(item.id)"></product-item>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .product {
    box-sizing: border-box;
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    height: calc(100vh - 92px);
    .left {
      width: 500px;
      height: 500px;
      ::v-deep .el-image {
        width: 500px;
        height: 500px;
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid rgb(200, 200, 200);
        border-radius: 10px;
      }
    }
    .right {
      width: 450px;
      height: 500px;
      overflow: hidden;
      box-sizing: border-box;
      padding-top: 100px;
      .name {
        color: rgb(86, 86, 86);
        margin-bottom: 20px;
      }
      .category {
        display: inline-block;
        color: rgb(156, 206, 173);
        font-size: 12px;
        padding: 3px;
        border: 1px solid rgb(156, 206, 173);
        border-radius: 5px;
        margin-bottom: 10px;
      }
      .description {
        width: 95%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 14px;
        margin-bottom: 15px;
      }
      .price {
        color: rgb(255, 82, 82);
        font-size: 18px;
        font-weight: 700;
        position: relative;
        display: inline-block;
        margin-bottom: 20px;
        span {
          font-size: 10px;
          border: 1px solid rgb(255, 82, 82);
          padding: 3px;
          border-radius: 3px;
          position: absolute;
          top: 0px;
          right: -40px;
        }
      }
      ::v-deep .el-input-number {
        margin-bottom: 20px;
      }
    }
  }
  .recommend {
    text-align: center;
    color: #fff;
    padding: 10px 0px;
    background-color: rgb(156, 206, 173);
  }
  .products {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    ::v-deep .productItem {
      cursor: pointer;
      margin-bottom: 30px;
      width: 29%;
      transition: all .3s ease;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
</style>