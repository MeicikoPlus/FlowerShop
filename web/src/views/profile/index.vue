<script setup>
  import { modifyUserPasswordApi, modifyUserMessageApi } from '@/api/user.js';
  import { ref, reactive, toRefs } from 'vue';
  import { useUserStore } from '@/store/userStore.js'
  import { ElMessage } from 'element-plus';
  import { getOrdersByUidApi } from '@/api/order.js'
  import { useRouter } from 'vue-router';

  const router = useRouter()
  const imageUrl = ref("")
  const orders = reactive([])
  const userStore = useUserStore()
  const { userinfo } = toRefs(userStore)
  const formData = reactive({
    avatar: userinfo.value.avatar,
    uid: userinfo.value.uid,
    username: userinfo.value.username,
    nickname: userinfo.value.nickname,
    sex: userinfo.value.sex ? userinfo.value.sex : 1,
    signature: userinfo.value.signature,
    file: null
  })
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}-${hours}:${minutes}`;
  }
  imageUrl.value = `http://127.0.0.1:3000${formData.avatar}`
  const handleImageChange = (event) => {
    let file = event.target.files[0];
    formData.file = file
    if (file&& file.type.startsWith('image/')) {
      imageUrl.value = URL.createObjectURL(file);
    } else {
      imageUrl.value = formData.avatar;
      console.error('Please select an image file.');
    }
  }
  const submit = () => {
    const obj = new FormData()

    obj.append('avatar', formData.file ? formData.file : formData.avatar)
    obj.append('nickname', formData.nickname)
    obj.append('sex', formData.sex)
    obj.append('signature', formData.signature)

    modifyUserMessageApi(obj).then(res => {
      if (res.code === 1000) {
        userStore.getUserInfo()
        ElMessage({
          type: "success",
          message: res.data.message ? res.data.message : "修改成功"
        })
      } else {
        ElMessage({
          type: "warning",
          message: res.data.message ? res.data.message : "修改失败"
        })
      }
    }).catch(err => {
      console.log('err: ', err)
    })
  }

  const dialogVisible = ref(false)
  const password = ref("")
  const rePassword = ref("")
  const modifyPassword = () => {
    if (password.value && rePassword.value) {
      modifyUserPasswordApi({
        oldPassword: password.value,
        newPassword: rePassword.value
      }).then(res => {
        if (res.code === 1000) {
          ElMessage({
            type: "success",
            message: res.data.message
          })
          dialogVisible.value = false
          userStore.resetToken()
          location.reload()
        } else {
          ElMessage.error(res.data.message ? res.data.message : "修改失败")
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      ElMessage.error("请完整的输入信息")
    }
  }

  const getOrdersByUid = () => {
    getOrdersByUidApi().then(res => {
      if (res.code === 1000) {
        orders.splice(0, orders.length - 1)
        orders.push(...res.data.orders)
      } else {  
        ElMessage.error(res.code.JSON.parse(orderInfo.message))
      }
    })
  }
  getOrdersByUid()
  const allPrice = (msg) => {
    let price = 0 
    msg.products?.forEach(item => {
      price += item.price * item.quantity
    })
    return price
  }
  const goPay = (id) => {
    router.push({ name: "pay", query: { id } })
  }
  const goAddress = () => {
    router.push({ name: "address" })
  }
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改密码"
    width="400"
  >
    <el-input
      v-model="password"
      style="width: 90%"
      type="password"
      placeholder="请输入旧密码"
    />
    <el-input
      v-model="rePassword"
      style="width: 90%; margin-top: 15px"
      type="password"
      placeholder="请输入新密码"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="modifyPassword">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
  <div class="container profile">
    <el-form :model="formData"
    label-position="top"
    style="width: 420px;"
    >
      <el-form-item class="first-item" label="avatar">
        <div class="select">点击选择图片<input type="file" accept="image/jpeg" @change="handleImageChange"></div>
        <div class="border"><el-image v-if="imageUrl" :src="imageUrl" alt="Selected image" /></div>
      </el-form-item>
      <el-form-item label="uid">
        <el-input
          v-model="formData.uid"
          style="width: 330px"
          disabled
        />
      </el-form-item>
      <el-form-item label="username">
        <el-input
          v-model="formData.username"
          style="width: 330px"
          disabled
        />
      </el-form-item>
      <el-form-item label="nickname">
        <el-input
          v-model="formData.nickname"
          style="width: 330px"
        />
      </el-form-item>
      <el-form-item label="sex">
        <el-radio-group v-model="formData.sex" class="ml-4">
          <el-radio v-model="formData.sex" :label="1">男</el-radio>
          <el-radio v-model="formData.sex" :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="signature">
        <el-input
          v-model="formData.signature"
          style="width: 330px"
          class="textarea"
          :rows="3"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>
      <el-form-item class="last-form-item" label="behavior">
        <el-button type="success" style="width: 330px;" @click="submit">修改信息</el-button>
        <el-button type="success" style="width: 330px;" @click="dialogVisible = true">修改密码</el-button>
        <el-button type="success" style="width: 330px;" @click="goAddress">查看地址</el-button>
      </el-form-item>
    </el-form>
    <div class="right">
      <el-scrollbar height="700px" style="width: 100%;">
        <template
          v-for="(orderInfo, index) in orders" :key="index"
        >
          <el-card style="width: 90%;">
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
              <p class="to-pay" v-if="orderInfo.state === '未支付'" @click="goPay(orderInfo.id)">去支付</p>
            </template>
          </el-card>
        </template>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p:nth-child(2) {
      color: rgb(156,206,173);
    }
  }
  .el-card {
    margin-top: 10px;
    position: relative;
  }
  .to-pay {
    position: absolute;
    right: 21px;
    bottom: 18px;
    color: rgb(156,206,173);
    cursor: pointer;
  }
  .right {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: end;
  }
  .profile {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .el-form {
      border-right: 2px dashed var(--el-border-color);
    }
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

  .select {
    width: 120px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    color: #fff;
    background-color: rgb(156,206,173);
    border-radius: 4px;
    border: 0;
    position: relative;
    margin-bottom: 10px;
    input {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
  }
  .last-form-item {
    width: 100%;
    .el-button {
      margin-top: 10px;
      margin-left: 0;
    }
  }
</style>