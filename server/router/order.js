const express = require("express")
const databaseObj = require("../tools/database")
const { jwtVerify} = require("../tools/jwt")
const { generateOrderNumber } = require("../tools/uuid")

// 创建商品路由
const router = express.Router()

// 生成订单接口
async function addOrder(req, res) {
  const data = req.body
  data.uid = req.uid
  const id = generateOrderNumber()
  data.id = id
  data.state = "未支付"
  try {
    await databaseObj.addOrder(data)
    res.send({ code: 1000, data: { message: "订单生成成功", id } })
  } catch (error) {
    console.log("添加订单接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/addOrder", jwtVerify, addOrder)

// 获取某个用户下的所有订单
async function getOrdersByUid(req, res) {
  const uid = req.uid;
  try {
    const orders = await databaseObj.findOrdersByUid(uid);
    res.send({ code: 1000, data: { message: "获取成功", orders } });
  } catch (error) {
    console.log("获取订单接口报错:", error);
    res.send({ code: 1003, data: { message: "服务繁忙" } });
  }
}
router.get("/getOrdersByUid", jwtVerify, getOrdersByUid);

// 获取某个订单详情
async function getOrderById(req, res) {
  const id = req.body.id;
  try {
    const order = await databaseObj.findOrderById(id);
    if (order.length === 0) {
      res.send({ code: 1001, data: { message: "订单不存在" } });
    } else {
      res.send({ code: 1000, data: order[0] });
    }
  } catch (error) {
    console.log("获取订单详情接口报错:", error);
    res.send({ code: 1003, data: { message: "服务繁忙" } });
  }
}
router.post("/getOrderById", jwtVerify, getOrderById);

// 删除订单接口
async function deleteOrder(req, res) {
  const id = req.body.id;
  try {
    const affectedRows = await databaseObj.deleteOrder(id);
    if (affectedRows === 0) {
      res.send({ code: 1001, data: { message: "订单不存在" } });
    } else {
      res.send({ code: 1000, data: { message: "订单删除成功" } });
    }
  } catch (error) {
    console.log("删除订单接口报错:", error);
    res.send({ code: 1003, data: { message: "服务繁忙" } });
  }
}
router.post("/deleteOrder", jwtVerify, deleteOrder);

// 更改订单状态接口
async function updateOrderState(req, res) {
  const { id, state } = req.body
  try {
    await databaseObj.updateOrderState(id, state);
    res.send({ code: 1000, data: { message: "订单状态更新成功" } });
  } catch (error) {
    console.log("更改订单状态接口报错:", error);
    res.send({ code: 1003, data: { message: "服务繁忙" } });
  }
}
router.post("/updateOrderState", jwtVerify, updateOrderState);

// 获取所有订单
async function getAllOrder(req, res) {
  try {
    const orders = await databaseObj.findAllOrder()
    res.send({ code: 1000, data: { message: "查询成功", orders } });
  } catch (error) {
    console.log("获取所有订单接口报错:", error);
    res.send({ code: 1003, data: { message: "服务繁忙" } });
  }
}
router.get("/getAllOrder", jwtVerify, getAllOrder)

module.exports = router