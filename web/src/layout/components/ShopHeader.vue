<script setup>
  import { onMounted, onUnmounted, reactive, ref } from 'vue';
  import { useUserStore } from '@/store/userStore.js';
  import { staticRoutes } from '@/router';
  import { Search } from '@element-plus/icons-vue'
  import { useRoute, useRouter } from 'vue-router';
  import { ArrowDown } from '@element-plus/icons-vue'
  import { findProductsByKeywordApi } from '@/api/product.js'
  import { myDebounce } from '@/utils/debounce.js'
  import { ElMessage } from 'element-plus';
  import { useCartStore } from '@/store/cartStore.js'
  const keyword = ref("")
  const searchResultsEl = ref(null)
  const inputEl = ref(null)
  const isHidden = ref(true)
  const userStore = useUserStore()
  const { userinfo, resetToken } = userStore
  const route = useRoute()
  const searchResults = reactive([])
  const router = useRouter()
  const goAdmin = () => {
    router.push({ name: "admin" })
  }
  const cartStore = useCartStore()
  const search = () => {
    if (keyword.value !== "") {
      router.push({ name:"search", query: { keyword: keyword.value } })
    } else {
      return
    }
  }
  const searchByKeyword = myDebounce(function () {
    if (keyword.value !== "") {
      findProductsByKeywordApi(keyword.value).then(res => {
        searchResults.splice(0, searchResults.length)
        searchResults.push(...res.data.products);
      }).catch(error => {
        console.log('error: ', error);
        ElMessage.error("网络错误")
      })
    } else {
      searchResults.splice(0, searchResults.length)
      return
    }
  }, 1000)
  onMounted(() => {
    document.body.onclick = (event) => {
      const clickedElement = event.target;
      if (
        (!inputEl.value || !inputEl.value.$el.contains(clickedElement)) &&
        (!searchResultsEl.value || !searchResultsEl.value.contains(clickedElement))
      ) {
        isHidden.value = true;
      }
    }
  })
  onUnmounted(() => {
    document.body.onclick = null;
  })
  const goProfile = () => {
    router.push({ name: "profile" })
  }
  const logout = () => {
    resetToken().then(res => {
      ElMessage.success("登出成功")
      location.reload()
    })
  }

</script>

<template>
  <header>
    <nav>
      <div class="dig" v-if="cartStore.carts.length > 0">{{ cartStore.carts ?  cartStore.carts.length : 0 }}</div>
      <div class="nav-left">
        <ul>
          <template v-for="(item, index) in staticRoutes" :key="index">
            <li v-if="!item.hidden" @click="liClick" :class="{'isActive' : route.path === item.redirect ? true : false }">
              <router-link :to="item.path" :class="{ 'option': true, 'isActive' : route.path === item.redirect ? true : false }">{{ item.children[0].meta.title }}</router-link>
            </li>
          </template>
        </ul>
      </div>
      <div class="nav-right">
        <div class="search-results" ref="searchResultsEl" :style="{ 'display' : isHidden ? 'none':'block' }">
          <ul class="resultsUl" v-if="searchResults.length > 0">
            <li v-for="(item, index) in searchResults" :key="index">
              <router-link :style="{ 'color': 'rgba(30, 30, 30, 0.6)' }" 
              :to="{ name: 'detail', query: { id: item.id } }">{{ item.product_name }}</router-link>
            </li>
          </ul>
        </div>
        <el-input
          ref="inputEl"
          v-model="keyword"
          style="width: 240px"
          placeholder="search"
          :clearable="true"
          @keydown.enter="search"
          @focus="isHidden = false"
          @input="searchByKeyword"
        >
          <template v-slot:prefix>
            <el-icon style="cursor: pointer;" @click="search"><Search /></el-icon>
          </template>
        </el-input>
        <el-button v-if="userinfo.isAdmin === 1" plain @click="goAdmin" round>打开控制台</el-button>
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ userinfo.nickname ? userinfo.nickname : userinfo.username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goProfile">个人信息</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
  header {
    box-shadow: var(--el-box-shadow-light);
    background-color: rgba(63, 61, 86);
    nav {
      width: 1100px;
      margin: 0 auto;
      min-width: 1000px;
      display: flex;
      position: relative;
      justify-content: space-between;
      align-items: center; 
      .dig {
        position: absolute;
        left: 227px;
        top: 10px;
        display: inline-block;
        width: 14px;
        text-align: center;
        line-height: 14px;
        height: 14px;
        background-color: rgb(255, 82, 82);
        color: #fff;
        border-radius: 50%;
        font-size: 10px;
      }
      .nav-left ul{
        display: flex;
        li {
          padding: 13px 22px;
          transition: background-color .4s ease;
          .option {
            color: rgba(156,206,173, 0.6);
            transition: all .4s ease;
            &:hover {
              color: rgba(156,206,173, 1);
            }
          }
          .option.isActive {
            // color: rgba(156,206,173, 1);
            color: #fff;
          }
        }
        li.isActive {
          // background-color: rgba(156,206,173, 0.1);
          background-color: rgba(156,206,173, 1);
        }
      }
      .nav-right {
        display: flex;
        align-items: center;
        position: relative;
        ::v-deep .el-dropdown-link {
          cursor: pointer;
          margin-left: 20px;
        }
        ::v-deep .el-input {
          height: 28px;
        }
        ::v-deep .el-button {
          margin-left: 20px;
          color: rgb(156,206,173);
          transition: all .3s ease;
          background-color: rgba(0, 0, 0, 0);
          border-color: rgb(156, 206, 173);
          transform: scale(0.85);
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
        .search-results {
          position: absolute;
          width: 240px;
          box-sizing: border-box;
          padding: 10px 0px;
          box-shadow: var(--el-box-shadow-light);
          left: 0;
          top: 40px;
          background-color: #fff;
          z-index: 10;
          .resultsUl {
            width: 100%;
            li {
              box-sizing: border-box;
              padding: 5px 10px;
              margin-top: 5px;
              transition: all .4s ease;
              &:hover {
                background-color: rgba(156, 206, 173, 0.1);
              }
            }
          }
        }
      }
    }
  }
</style>