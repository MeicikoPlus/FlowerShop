const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const userRouter = require("./router/user")
const addressRouter = require("./router/address")
const productRouter = require("./router/product")
const cartRouter = require("./router/cart")
const toolRouter = require("./router/tool")
const orderRouter = require("./router/order")

const app = express()
// 全局使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: true }))
// express.json()用来解析JSON格式的请求体数据
app.use(express.json())

// 将 public 目录设置为静态资源目录
app.use(express.static(path.join(__dirname, 'public')))

// 用户模块 (登录，注册，修改密码，修改信息)
app.use("/user", userRouter)

// 用户地址模块 (增删改查)
app.use("/address", addressRouter)

// 商品模块
app.use("/product", productRouter)

// 购物车模块
app.use("/cart", cartRouter)

// 工具模块(其他模块)
app.use("/tool", toolRouter)

// 订单模块
app.use("/order", orderRouter)

const port = 3000
app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`)
})