<script setup>
  import { ref, reactive, toRefs, computed } from 'vue';
  import { useCartStore } from '@/store/cartStore.js';
  import { myDebounce } from '@/utils/debounce.js'
  import { pcaTextArr } from 'element-china-area-data'
  import { useAddressStore } from '@/store/addressStore.js';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { useUserStore } from '@/store/userStore.js'
  import { addOrderApi } from '@/api/order.js'
  import { useRouter } from 'vue-router';
  const router = useRouter()
  const cartStore = useCartStore()
  const userStore = useUserStore()
  const { carts } = toRefs(cartStore)
  const multipleSelection = ref([])
  
  const handleSelectionChange = (val) => {
    multipleSelection.value = val
  }
  const handleChange = myDebounce((obj) => {
    const { id, quantity } = obj
    cartStore.updateCartItem(id, quantity)
  }, 500)

  const deleteItem = (arr) => {
    if (arr.length === 0) return
    cartStore.deleteCartById(arr)
  }
  const deleteItems = () => {
    if (multipleSelection.value.length === 0) return
    const arr = []
    multipleSelection.value.forEach(item => {
      arr.push(item.id)
    })
    deleteItem(arr)
  }
  const allPrice = computed(() => {
    let price = 0 
    multipleSelection.value.forEach(item => {
      price += item.price * item.quantity
    })
    return price
  })
  const dialogTableVisible = ref(false)
  const addressStore = useAddressStore()
  const { addresses } = toRefs(addressStore)
  const addressChoose = ref("")
  const handleCurrentChange = (val) => {
    addressChoose.value = val
  }
  const buy = () => {
    dialogTableVisible.value = true
  }

  const isAddAddress = ref(false)
  const selectedOptions = ref("")
  const xxAddress = ref("")
  const addOrder = () => {
    if (multipleSelection.value.length === 0) {
      ElMessage({
        type: "warning",
        message: "请先选择商品"
      })
      return 
    }
    if(addressChoose.value === "") {
      ElMessage({
        type: "warning",
        message: "请先选择地址"
      })
      return 
    }
    const message = JSON.stringify({
      user: userStore.userinfo,
      address: addressChoose.value,
      products: multipleSelection.value
    })
    const time = Date.now()
    addOrderApi({
      message,
      time
    }).then(res => {
      if (res.code === 1000) {
        deleteItems()
        ElMessageBox.alert("前往支付?", "提示", {
          confirmButtonText: 'OK',
          callback: () => {
            router.push({ name: "pay", query: { id: res.data.id } })
          }
        })
      }
    })
  }
  const addAddressReally = () => {
    const obj = {
      uid: userStore.userinfo.uid,
      simple_address: selectedOptions.value.join(""),
      detailed_address: xxAddress.value
    }
    addressStore.addAddress(obj)
  }
</script>

<template>
  <el-dialog v-model="isAddAddress">
    <div class="dialog-item">
      <p>地址</p>
      <el-cascader
        style="width: 40%;"
        size="large"
        :options="pcaTextArr"
        v-model="selectedOptions">
      </el-cascader>
    </div>
    <div class="dialog-item">
      <p>地址</p>
      <el-input style="width: 40%;" v-model="xxAddress" placeholder="请输入详细地址"></el-input>
    </div>
    <div class="dialog-item add">
      <el-button type="success" @click="addAddressReally">添加地址</el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="dialogTableVisible" title="选择地址" width="800">
    <template v-if="addresses.length === 0">
      <el-empty description="还沒有地址哦~" />
      <div style="display: flex; justify-content: space-between">
        <el-button type="success" @click="isAddAddress = true">添加地址</el-button>
      </div>
    </template>
    <template v-else>
      <el-table :data="addresses"  highlight-current-row  @current-change="handleCurrentChange">
        <el-table-column prop="simple_address" label="地址" />
        <el-table-column prop="detailed_address" label="详细地址" />
      </el-table>
      <el-button style="margin-top: 20px;" type="warning" @click="addOrder">确定</el-button>
    </template>
  </el-dialog>
  <h2>购物车</h2>
  <div class="container cart">
    <template v-if="carts === null || carts.length === 0">
      <div class="null">
        <el-empty description="购物车空空如也~" />
      </div>
    </template>
    <template v-else>
      <el-table :data="carts" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <!-- 商品照片 -->
        <el-table-column label="product" width="120">
          <template #default="scope">
            <el-image class="table-image" :src="`http://127.0.0.1:3000/flower/${scope.row.product_image}`" lazy></el-image>
          </template>
        </el-table-column>
        <!-- 商品名称 -->
        <el-table-column label="name">
          <template #default="scope">
            <p>{{ scope.row.product_name }}</p>
          </template>
        </el-table-column>
        <!-- 商品数量 -->
        <el-table-column label="quantity">
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity" @change="handleChange(scope.row)" />
          </template>
        </el-table-column>
        <!-- 商品价格 -->
        <el-table-column label="price">
          <template #default="scope">
            <p>{{ scope.row.quantity * scope.row.price }}</p>
          </template>
        </el-table-column>
        <!-- 行为 -->
        <el-table-column label="behavior">
          <template #default="scope">
            <el-button @click="deleteItem([scope.row.id])" type="danger" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom" style="margin-top: 20px;">
        <el-button style="margin-right: 30px;" @click="deleteItems()" type="danger" plain>删除所有选中商品</el-button>
        <el-button style="margin-right: 30px;" disabled>{{ allPrice }}元</el-button>
        <el-button style="float: right; margin-right: 149px" @click="buy()" type="danger" plain>下单</el-button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
  h2 {
    text-align: center;
    color: #fff;
    padding: 10px 0px;
    background-color: rgb(156, 206, 173);
  }
  .null {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
  }
  .cart {
    padding-top: 20px;
  }
  .el-table {
    border: 1px solid rgb(235,238,245);
    border-bottom: 0;
    ::v-deep .table-image {
      width: 50px;
      height: 50px;
    }
  }
  .bottom {
    border: 1px solid rgb(235,238,245);
    box-sizing: border-box;
    padding: 20px 10px;
  }
  .dialog-item {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    p {
      width: 20%;
      text-align: left;
    }
  }
  .dialog-item.add {
    padding: 20px 100px 0px 0px;
    display: flex;
    justify-content: end;
  }
</style>