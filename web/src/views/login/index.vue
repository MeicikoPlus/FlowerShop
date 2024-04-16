<script setup>
  import { ref, reactive, onMounted, onUnmounted } from 'vue'
  import { addRibbonsToElement } from '@/plugins/bg.js'
  import { useUserStore } from '@/store/userStore.js'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import NProgress from 'nprogress'
  const frame = ref(null)
  const ruleFormEl = ref(null)
  const isHidden = ref(true)
  const ribbonsInstance = ref("")
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const { login } = userStore

  onMounted(() => {
    ribbonsInstance.value = addRibbonsToElement(frame.value)
  })
  onUnmounted(() => {
    ribbonsInstance.value = null
  })

  const formData = reactive({
    username: "",
    password: ""
  })

  const rules = reactive({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: 'Length should be 2 to 10', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 12, message: 'Length should be 5 to 10', trigger: 'blur' },
    ]
  })

  const submit = async (formEl) => {
    NProgress.start()
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        login(formData).then(res => {
          if (res.code === 1000) {
            router.push({ path: route.query.redirect || '/' })  
          } else {
            ElMessage({
              message: res.data.message,
              type: 'warning',
            })
          }
          NProgress.done()
        }).catch(error => {
          NProgress.done()
          ElMessage.error(error || "Busy service")
        })
      } else {
        NProgress.done()
      }
    })
  }

</script>

<template>
  <div class="login">
    <div class="frame" ref="frame"></div> 
    <div class="main">
      <h1 class="title">Login</h1>
      <el-form
      ref="ruleFormEl"
      label-position="top"
      label-width="auto"
      :model="formData"
      :rules="rules"
      :hide-required-asterisk="isHidden"
      >
        <el-form-item label="username" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input v-model="formData.password" />
        </el-form-item>
        <el-form-item label="behavior" class="submit-form-item">
          <el-button type="success" @click="submit(ruleFormEl)">submit</el-button>
        </el-form-item>
        <el-form-item class="last-form-item">
          <router-link to="register" class="go-register">no account? go to register	&#8674</router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .login {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .frame {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -10;
      background-color: rgb(40, 40, 40);
    }
    .main {
      width: 350px;
      border-radius: 10px;
      background-color: rgba(78, 78, 78, 0.1);
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all .5s ease;
      border: 3px solid rgba(225, 225, 225, 0);
      box-sizing: border-box;
      padding: 30px 30px 10px 30px;
      &:hover {
        transform: scale(1.05);
        background-color: rgba(78, 78, 78, 0.2);
        border-color: rgba(225, 225, 225, 0.13);
      }
      .title {
        width: 100px;
        margin: 20px auto;
        color: rgba(255, 255, 255, 0.8)
      }
      ::v-deep .el-form-item__label {
        color: rgba(255, 255, 255, 0.8)
      }
      ::v-deep .el-input {
        --el-input-focus-border-color: rgba(0, 0, 0, 0);
      }
      ::v-deep .el-input__wrapper {
        background-color: rgba(255, 255, 255, 0.8) !important;
        box-shadow: 0;
      }
      .submit-form-item {
        margin-top:10px;
        .el-button {
          width: 100%;
        }
      }
      .last-form-item ::v-deep .el-form-item__content{
        display: flex;
        justify-content: end;
        align-items: center;
      }
      .go-register {
        text-decoration: none;
        color: rgba(61, 127, 174);
      }
    }
  }
</style>