<script setup>
  import { ref, reactive, onUnmounted } from 'vue';
  import { getAllOrderApi, updateOrderStateApi, getPaidOrderApi, getCompletedOrderApi, getUnpaidOrderApi } from '@/api/order.js'
  import { ElMessage } from 'element-plus';

  const orders = reactive([])
  const option = ref(true)
  const getAllOrder = () => {
    option.value = true
    getAllOrderApi().then(res => {
      if (res.code === 1000) {
        orders.splice(0, orders.length)
        orders.push(...res.data.orders)
      }
    })
  }
  getAllOrder()
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}-${hours}:${minutes}`;
  }
  const allPrice = (msg) => {
    let price = 0 
    msg.products?.forEach(item => {
      price += item.price * item.quantity
    })
    return price
  }
  const modifyState = (id) => {
    updateOrderStateApi(id, "已完成").then(res => {
      if (res.code === 1000) {
        ElMessage.success("修改完成")
        getAllOrder()
      }
    })
  }

  const timer = setInterval(() => {
    if (option.value) {
      getAllOrder()
    }
  }, 60000)

  onUnmounted(() => {
    clearInterval(timer)
  })

  const getPaidOrder = () => {
    option.value = false
    getPaidOrderApi().then(res => {
      if (res.code === 1000) {
        orders.splice(0, orders.length)
        orders.push(...res.data.orders)
      }
    })
  }

  const getCompletedOrder = () => {
    option.value = false
    getCompletedOrderApi().then(res => {
      if (res.code === 1000) {
        orders.splice(0, orders.length)
        orders.push(...res.data.orders)
      }
    })
  }

  const getUnpaidOrder = () => {
    option.value = false
    getUnpaidOrderApi().then(res => {
      if (res.code === 1000) {
        orders.splice(0, orders.length)
        orders.push(...res.data.orders)
      }
    })
  }
</script>

<template>
  <div class="orderManagement">
    <el-divider content-position="left">订单管理</el-divider>
    <div class="content">
      <div class="btns">
        <el-button link type="primary" @click="getAllOrder">所有订单</el-button>
        <el-button link type="primary" @click="getPaidOrder">已支付</el-button>
        <el-button link type="primary" @click="getCompletedOrder">已完成</el-button>
        <el-button link type="primary" @click="getUnpaidOrder">未支付</el-button>
      </div>
      <template v-if="orders.length > 0">
        <template
          v-for="(orderInfo, index) in orders" :key="index"
        >
          <el-card style="width: 100%;">
            <template #header>
              <div class="top">
                <p>{{ formatTimestamp(orderInfo.time) }}</p>
                <p>{{ orderInfo.state }}</p>
              </div>
            </template>
            <p style="margin-bottom: 10px;">{{ `${JSON.parse(orderInfo.message)?.address?.simple_address} ${JSON.parse(orderInfo.message)?.address?.detailed_address}` }}</p>
            <p style="margin-bottom: 10px;" v-for="(item, index) in JSON.parse(orderInfo.message)?.products" :key="index">{{ `${item.product_name} * ${item.quantity}` }}</p>
            <p>{{ allPrice(JSON.parse(orderInfo.message)) }}元</p>
            <template #footer>
              <p>{{ JSON.parse(orderInfo.message)?.user?.username }}</p>
              <el-popconfirm v-if="orderInfo.state === '已支付'" title="确定订单已完成?" @confirm="modifyState(orderInfo.id)">
                <template #reference>
                  <el-button link type="primary">修改状态</el-button>
                </template>
              </el-popconfirm>
              <el-button link type="primary" v-if="orderInfo.state === '已完成'">已完成</el-button>
            </template>
          </el-card>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang='scss'>
  .orderManagement {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding-top: 30px;
    .content {
      width: 90%;
      margin: 0 auto;
      .el-card {
        margin-top: 20px;
        .el-button {
          position: absolute;
          right: 21px;
          bottom: 18px;
        }
      }
    }
  }
  .el-card {
    margin-top: 10px;
    position: relative;
  }
  .right {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: end;
  }
  .border {
    width: 120px;
    height: 120px;
    border: 2px dashed var(--el-border-color);
  }
  .el-image {
    width: 100%;
    height: 100%;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p:nth-child(2) {
      color: rgb(156,206,173);
    }
  }
</style>