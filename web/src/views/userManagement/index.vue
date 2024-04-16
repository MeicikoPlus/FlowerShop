<script setup>
  import { ref, reactive } from 'vue';
  import { getAllUserApi, getUserMessageByUsernameApi, deleteUserApi } from '@/api/user.js'
  import { ElMessage } from 'element-plus'

  const users = reactive([])
  const search = ref("")
  const getAllUser = () => {
    getAllUserApi().then(res => {
      if (res.code === 1000) {
        users.splice(0, users.length)
        users.push(...res.data.users)
      } else {
        ElMessage.error("获取用户失败")
      }
    }).catch(err => {
      ElMessage.error("服务繁忙")
    })  
  }
  getAllUser()
  const searchByName = () => {
    getUserMessageByUsernameApi(search.value).then(res => {
      if (res.code === 1000) {
        users.splice(0, users.length)
        users.push(...res.data.users)
      }
    })
  }
  const confirmEvent = (uid) => {
    deleteUserApi(uid).then(res => {
      if (res.code === 1000) {
        ElMessage.success("注销成功")
        getAllUser()
      }
    })
  }
</script>

<template>
  <div class="userManagement">
    <el-divider content-position="left">用户表</el-divider>
    <el-table :data="users" stripe>
      <el-table-column prop="uid" label="头像">
        <template #default="scope">
          <el-image :src="scope.row.avatar ? `http://127.0.0.1:3000${scope.row.avatar}` : 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" lazy></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="uid" width="400" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column label="性别">
        <template #default="scope">
          {{ scope.row.sex === 1 ? '男' : scope.row.sex === 0 ? '女' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column label="角色">
        <template #default="scope">
          {{ scope.row.isAdmin === 1 ? "管理员" : "客户" }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="120">
        <template #header>
          <el-input v-model="search" size="small" placeholder="username to search" @keyup.enter="searchByName" />
        </template>
        <template #default="scope">
          <el-popconfirm
            confirm-button-text="Yes"
            cancel-button-text="No"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="确定注销这个用户吗?"
            v-if="scope.row.isAdmin !== 1"
            @confirm="confirmEvent(scope.row.uid)"
          >
            <template #reference>
              <el-button link type="primary">注销</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>  
    </el-table>
  </div>  
</template>

<style scoped lang='scss'>
  .userManagement {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding-top: 30px;
    .el-table {
      width: 95%;
      max-height: 80%;
      margin: 0 auto;
      .el-image {
        width: 40px;
        height: 40px
      }

    }
  }
</style>