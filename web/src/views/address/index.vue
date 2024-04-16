<script setup>
  import { ref, reactive, toRefs } from 'vue'
  import { useAddressStore } from '@/store/addressStore'
  import { useUserStore } from '@/store/userStore'
  import { pcaTextArr } from 'element-china-area-data'
  import { ElMessage } from 'element-plus';

  const addressStore = useAddressStore()
  const userStore = useUserStore()
  const dialogTableVisible = ref(false)
  const control = ref("")
  const formData = reactive({
    detailed_address: "",
    simple_address: ""
  })
  const controlAddress = ref("")
  const { addresses } = toRefs(addressStore)
  const deleteAddress = (id) => {
    addressStore.deleteAddress(id)
  }
  const submit = () => {
    console.log()
    if (control.value === 1) {
      if (formData.detailed_address && formData.simple_address) {
        addressStore.addAddress({
          uid: userStore.userinfo.uid,
          detailed_address: formData.detailed_address.join(""),
          simple_address: formData.simple_address
        })
        dialogTableVisible.value = false
      } else {
        ElMessage.error("请先输入地址")
        return
      }
    } else if (control.value === 0) {
      if (formData.detailed_address && formData.simple_address) {
        addressStore.modifyAddress({
          id: controlAddress.value.id,
          detailed_address: formData.detailed_address.join(""),
          simple_address: formData.simple_address
        })
        dialogTableVisible.value = false
      } else {
        ElMessage.error("请先输入地址")
        return
      }
    }
  }
  const add = () => {
    dialogTableVisible.value = true
    control.value = 1
  }
  const modify = (data) => {
    dialogTableVisible.value = true
    control.value = 0
    controlAddress.value = data
  }
</script>

<template>
  <div class="address container">
    <el-dialog v-model="dialogTableVisible" title="添加地址" width="500">
      <el-form v-model="formData">
        <el-form-item label="省/市/区">
          <el-cascader
            v-model="formData.detailed_address"
            :options="pcaTextArr" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="formData.simple_address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-table :data="addresses">
      <el-table-column prop="detailed_address" label="省/市/区" />
      <el-table-column prop="simple_address" label="详细地址" />
      <el-table-column label="操作" width="200">
        <template #header>
          <el-button type="warning" @click="add">添加地址</el-button>
        </template>
        <template #default="scope"> 
          <el-button type="warning" @click="modify(scope.row)">修改</el-button>
          <el-button type="danger" @click="deleteAddress(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<style scoped lang='scss'>
  .address {
    height: 100%;
    padding-top: 20px;
    .el-input {
      width: 203px;
    }
  }
</style>