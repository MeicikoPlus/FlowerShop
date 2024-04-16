<script setup>
  import { ref, reactive, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { paginateAllProductsApi,
    addProductApi,
    getProductCountApi, 
    deleteProductApi,
    decreaseProductInventoryApi,
    findProductsByKeywordApi,
    findProductCategoryApi
  } from '@/api/product.js'

  const page = ref(1)
  const pageSize = ref(10)
  const products = ref([])
  const productCount = ref(0)
  const keyword = ref("")
  const dialogVisible = ref(false)
  const categories = ref([])
  const formData = reactive({
    file: "",
    product_category: "",
    product_name: "",
    product_description: "",
    product_price: 0,
    product_discount: 1,
    product_number: 1000
  })
  const imageUrl = ref("")
  // 分页查询
  const paginateAllProducts = () => {
    paginateAllProductsApi(page.value, pageSize.value).then(res => {
      if (res.code === 1000) {
        products.value = res.data.products
        pageSize.value = 10
      }
    })
  }
  // 查询页面总数
  const getProductCount = () => {
    getProductCountApi().then(res => {
      if (res.code === 1000) {
        productCount.value = res.data.totalCount
      }
    })
  }
  // 删除商品
  const deleteProduct = (productId) => {
    deleteProductApi(productId).then(res => {
      if (res.code === 1000) {
        ElMessage({
          type: "success",
          message: "删除成功"
        })
        getProductCount()
        paginateAllProducts()
      }
    })
  }
  getProductCount()
  paginateAllProducts()

  // 页码改变
  const pageChange = (num) => {
    page.value = num
  }
  // 修改商品数量
  const handleChange = (count, id) => {
    decreaseProductInventoryApi({ id, quantity: count })
  }
  const findProductCategory = () => {
    findProductCategoryApi().then(res => {
      if (res.code === 1000) {
        categories.value = res.data.products
      }
    })
  }
  findProductCategory()
  const searchProductByKeyword = () => {
    if (keyword.value !== "") {
      findProductsByKeywordApi(keyword.value).then(res => {
        if (res.code === 1000) {
          products.value = res.data.products
          pageSize.value = products.value.length
          productCount.value = products.value.length
        }
      })
    } else {
      getProductCount()
      paginateAllProducts()
    }
  }

  const handleImageChange = (event) => {
    let file = event.target.files[0];
    formData.file = file
    imageUrl.value = URL.createObjectURL(file);
    
  }

  const addNewProduct = () => {
    const obj = new FormData()
    obj.append('product_image', formData.file)
    obj.append('product_category', formData.product_category)
    obj.append('product_name', formData.product_name)
    obj.append('product_description', formData.product_description)
    obj.append('product_price', formData.product_price)
    obj.append('product_discount', formData.product_discount)
    obj.append('product_number', formData.product_number)

    console.log(obj)
    addProductApi(obj).then(res => {
      if (res.code === 1000) {
        ElMessage({
          type: "success",
          message: res.data.message ? res.data.message : "修改成功"
        })
        getProductCount()
        paginateAllProducts()
      }
    })
  }

  // 刷新
  const refresh = () => {
    getProductCount()
    paginateAllProducts()
  }
  // 监听页码的变化
  watch(page, () => {
    getProductCount()
    paginateAllProducts()
  })
</script>

<template>
  <div class="product">
    <el-divider content-position="left">订单管理</el-divider>
    <div class="content">
      <el-button link type="primary" @click="refresh">刷新</el-button>
      <el-button link type="primary" @click="dialogVisible = true">添加</el-button>
      
      <el-dialog v-model="dialogVisible" title="添加商品" width="800">
        <el-form :model="formData">
          <el-form-item class="first-item" label="商品图片">
            <div class="select">点击选择图片<input type="file" accept="image/jpeg" @change="handleImageChange"></div>
            <div class="border"><el-image v-if="imageUrl" :src="imageUrl" alt="Selected image" /></div>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select
              v-model="formData.product_category"
              placeholder="Select"
              style="width: 240px"
            >
              <el-option
                v-for="item in categories"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="formData.product_name" style="width: 240px" placeholder="Please input" />
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input-number v-model="formData.product_price" />
          </el-form-item>
          <el-form-item label="商品折扣">
            <el-input-number v-model="formData.product_discount" :precision="2" :step="0.1" />
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input-number v-model="formData.product_number" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="addNewProduct">
              Confirm
            </el-button>
          </div>
        </template>
      </el-dialog>

      <el-table :data="products" border style="width: 100%" height="400">
        <el-table-column label="图像" width="80">
          <template #default="scope">
            <el-image :src="scope.row.product_image ? `http://127.0.0.1:3000/flower/${scope.row.product_image}` : 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" lazy></el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="product_name" width="180"></el-table-column>
        <el-table-column label="分类" prop="product_category" width="180"></el-table-column>
        <el-table-column label="详情" width="240">
          <template #default="scope">
            <p>{{ scope.row.product_description.slice(0, 19) }}...</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="product_price" width="180"></el-table-column>
        <el-table-column label="折扣" prop="product_discount" width="180"></el-table-column>
        <el-table-column label="数量" width="200">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.product_number"
              size="small"
              controls-position="right"
              @change="handleChange($event, scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #header>
            <el-input v-model="keyword" size="small" @keydown.enter="searchProductByKeyword" placeholder="To Search" />
          </template>
          <template #default="scope">
            <el-button link type="primary" @click="deleteProduct(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageSize"
        :pager-count="5"
        layout="prev, pager, next"
        :total="productCount"
        @change="pageChange"
      />
    </div>
  </div>
</template>

<style scoped lang='scss'>
  .product {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding-top: 30px;
    .content {
      width: 90%;
      margin: 0 auto;
    }
    .el-table {
      margin: 15px 0px;
    }
    .el-image {
          width: 40px;
          height: 40px;
        }
    .el-pagination {
      display: flex;
      justify-content: center;
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
  }
</style>