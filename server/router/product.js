const express = require("express")
const path = require("path")
const fs = require("fs")
const multer = require('multer');
const databaseObj = require("../tools/database")

// 创建商品路由
const router = express.Router()

// 创建一个multer实例
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/flower');  // 存储的目录，确保该目录已存在
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // 使用时间戳和原始文件名作为新文件名
  }
})
const upload = multer({ storage: storage })

// 根据id查询商品信息
async function findProductById(req, res) {
  const id = req.query.id
  try {
    const result = await databaseObj.findProductById(id)
    res.send({ code: 1000, data: { message: "查询成功", product: result } })
  } catch (error) {
    console.log("根据id查询商品信息接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.get("/findProductById", findProductById)

// 随机查询指定条商品数据
async function findRandomProducts(req, res) {
  const num = req.query.num
  try {
    const result = await databaseObj.findProductRandom(num)
    res.send({ code: 1000, data: { message: "查询成功", products: result } })
  } catch (error) {
    console.log("随机查询商品接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.get("/findRandomProducts", findRandomProducts)

// 根据分类来查询某个分类的所有商品
async function findProductsByCategory(req, res) {
  const category = req.query.category
  try {
    const result = await databaseObj.findProductByCategory(category)
    res.send({ code: 1000, data: { message: "查询成功", products: result } })
  } catch (error) {
    console.log("根据分类查询商品接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.get("/findProductsByCategory", findProductsByCategory)

// 根据关键词来查询商品
async function findProductsByKeyword(req, res) {
  const keyword = req.query.keyword
  try {
    const result = await databaseObj.findProductByKeyword(keyword)
    res.send({ code: 1000, data: { message: "查询成功", products: result } })
  } catch (error) {
    console.log("关键词查询商品接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.get("/findProductsByKeyword", findProductsByKeyword)

// 查询商品的所有分类
async function findProductCategory(req, res) {
  try {
    const result = await databaseObj.findProductCategory()
    res.send({ code: 1000, data: { message: "查询成功", products: result } })
  } catch (error) {
    console.log("根据分类查询商品接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.get("/findProductCategory", findProductCategory)

// 添加某个商品的存货
async function increaseProductInventory(req, res) {
  const productId = req.body.id
  const quantity = req.body.quantity

  try {
    await databaseObj.increaseProductionNumber(productId, quantity)
    res.send({ code: 1000, data: { message: "增加存货成功" } })
  } catch (error) {
    console.log("增加商品存货接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/increaseProductInventory", increaseProductInventory)

// 减少某个商品的存货
async function decreaseProductInventory(req, res) {
  const productId = req.body.id
  const quantity = req.body.quantity

  try {
    await databaseObj.decreaseProductInventory(productId, quantity)
    res.send({ code: 1000, data: { message: "存货成功" } })
  } catch (error) {
    console.log("减少商品存货接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/decreaseProductInventory", decreaseProductInventory)

// 删除某个商品
async function deleteProduct(req, res) {
  const { id } = req.body
  try {
    await databaseObj.deleteProduct(id)
    res.send({ code: 1000, data: { message: "删除成功" } })
  } catch (error) {
    console.log("删除商品接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/deleteProduct", deleteProduct)

// 分页查询
async function paginateAllProducts(req, res) {
  const { page, pageSize } = req.body
  try {
    const products = await databaseObj.paginateAllProducts(page, pageSize)
    res.send({ code: 1000, data: { message: "查询成功", products } })
  } catch (error) {
    console.log("分页查询接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/paginateAllProducts", paginateAllProducts)

// 商品上传信息接口
async function addProduct(req, res) {
  const data = req.body;
  const file = req.file;
  try {
    if (!file) {
      return res.status(400).send({ code: 1001, data: { message: '未上传商品图片' } });
    }

    // 构建新的文件名，例如使用商品名称
    const newFileName = `${data.product_name}.jpg`;

    // 构建新的文件路径
    const newPath = path.join(__dirname, '../public/flower', newFileName);

    // 重命名文件
    fs.renameSync(file.path, newPath);

    // 更新商品信息中的图片路径为新的文件路径
    data.product_image = `${newFileName}`;

    // 将商品信息保存到数据库
    await databaseObj.addProduct(data);
    
    res.send({ code: 1000, data: { message: '商品信息上传成功' } });
  } catch (error) {
    console.error('商品上传信息接口错误：', error);
    res.send({ code: 1003, data: { message: '服务繁忙' } });
  }
}
// 使用multer中间件处理文件上传，并调用商品信息上传处理函数
router.post("/addProduct", upload.single('product_image'), addProduct);


// 接口：获取商品总数
async function getProductCount(req, res) {
  try {
    const totalCount = await databaseObj.getTotalProductCount();
    res.send({ code: 1000, data: { message: "获取成功", totalCount } });
  } catch (error) {
    console.log("获取商品总数接口报错:", error);
    res.send({ code: 1003, data: { message: "服务繁忙" } });
  }
}
router.get("/getProductCount", getProductCount);

module.exports = router