<script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { getOrderByIdApi, updateOrderStateApi } from '@/api/order.js'
  import { ElMessage } from 'element-plus'
  const route = useRoute()
  const id = route.query.id
  const orderInfo = ref("")
  const msg = ref("")
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}-${hours}:${minutes}`;
  }
  const getOrderById = () => {
    getOrderByIdApi(id).then(res => {
      if (res.code === 1000) {
        orderInfo.value = res.data
        msg.value = JSON.parse(orderInfo.value.message)
      } else {
        ElMessage.error(res.code.msg)
      }
    })
  }
  getOrderById()
  const allPrice = computed(() => {
    let price = 0 
    msg.value?.products?.forEach(item => {
      price += item.price * item.quantity
    })
    return price
  })
  const modifyState = (id) => {
    updateOrderStateApi(id, "已支付").then(res => {
      if (res.code === 1000) {
        ElMessage.success("修改完成")
        getOrderById()
      }
    })
  }
</script>

<template>
  <div class="container pay">
    <el-card style="width: 100%;">
      <template #header>
        <div class="top">
          <p>{{ formatTimestamp(orderInfo.time) }}</p>
          <p>{{ orderInfo.state }}</p>
        </div>
      </template>
      <p style="margin-bottom: 10px;">{{ `${msg?.address?.simple_address} ${msg?.address?.detailed_address}` }}</p>
      <p style="margin-bottom: 10px;" v-for="(item, index) in msg?.products" :key="index">{{ `${item.product_name} * ${item.quantity}` }}</p>
      <div style="display: flex; justify-content: center; align-items: center">
        <el-image lazy src="http://127.0.0.1:3000/pic.jpg"></el-image>
      </div>
      <p>{{ allPrice }}元</p>
      <template #footer>
        <p>{{ msg?.user?.username }}</p>
        <el-button link type="primary" @click="modifyState(orderInfo.id)">我已支付</el-button>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang='scss'>
  .pay {
    padding-top: 20px;
    position: relative;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p:nth-child(2) {
        color: rgb(156,206,173);
      }
    }
    .el-button {
      position: absolute;
      right: 21px;
      bottom: 18px;
    }
    .el-image {
      width: 300px;
      height: 300px;
    }
  }
</style>