<script setup>
  import { ref, reactive, inject, watchEffect } from 'vue'
  import { findProductCategoryApi } from '@/api/product'
  import CategoryProducts from './components/CategoryProducts.vue'
  import { ElMessage } from 'element-plus';
  const productCategory = reactive([])
  const categoryEls = ref([])
  const index = ref(0)
  const findProductCategory = () => {
    findProductCategoryApi().then(res => {
      if (res.code === 1000) {
        productCategory.splice(0, productCategory.length)
        productCategory.push(...res.data.products)
      } else {
        ElMessage({
          message: res?.data?.message || "服务繁忙",
          type: "warning"
        })
      }
    })
  }
  findProductCategory()
  const scroll = inject("scroll")
  const BarScrollTop = inject("BarScrollTop")
  const scrollProduct = (i) => {
    index.value = i
    scroll(categoryEls.value[index.value].$el.offsetTop)
  }
  watchEffect(() => {
    for (let i = 0; i < categoryEls.value.length; i++) {
      if (BarScrollTop.value >= categoryEls.value[i].$el.offsetTop) {
        index.value = i
      } else {
        return
      }
    }
  })
</script>

<template>
  <div class="product">
    <div class="container products">
      <aside>
        <ul>
          <li v-for="(item, i) in productCategory" 
          :key="i"
          @click="scrollProduct(i)"
          :class="{ isActive: i === index }"
          >
            {{ item }}
          </li>
        </ul>
      </aside>
      <main>
        <category-products v-for="(item, index) in productCategory" 
        :key="index" 
        :category="item"
        ref="categoryEls"
        ></category-products>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .products {
    position: relative;
    aside {
      width: 150px;
      border-radius: 10px;
      border: 2px solid rgba(63, 61, 86, 0.3);
      color: rgba(63, 61, 86, 0.6);
      position: fixed;
      right: calc(((100% - 1100px) / 2) + 1150px);
      background-color: #fff;
      top: 120px;
      z-index: 10;
      ul {
        box-sizing: border-box;
        padding: 10px 0px;
        li {
          box-sizing: border-box;
          padding: 10px 15px;
          text-align: center;
          cursor: pointer;
          &:hover {
            background-color: rgba(63, 61, 86, 0.08);
          }
        }
        li.isActive {
          background-color: rgba(63, 61, 86, 0.08);
        }
      }
    }
  }
</style>