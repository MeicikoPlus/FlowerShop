const express = require("express")
const databaseObj = require("../tools/database")

// 创建地址路由
const router = express.Router()

// 获取轮播图信息
async function getSlideShowMsg(req, res) {
  try {
    const result = await databaseObj.getSlideShowMsg()
    res.send({ code: 1000, data: { message: "轮播图查询成功", data: result } })
  } catch (error) {
    console.log("获取轮播图信息接口报错:", error)
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.get("/getSlideShowMsg", getSlideShowMsg)

// 导出地址路由
module.exports = router