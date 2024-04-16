const express = require("express")
const path = require("path")
const fs = require("fs")
const multer = require('multer');
const databaseObj = require("../tools/database")
const { createToken, jwtVerify} = require("../tools/jwt")
const { generateUid } = require("../tools/uuid")

// 创建用户路由
const router = express.Router()

// 创建一个multer实例
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatar');  // 存储的目录，确保该目录已存在
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // 使用时间戳和原始文件名作为新文件名
  }
});
const upload = multer({ storage: storage });

// 用户注册接口
async function register(req, res) {
  const data = req.body
  try {
    const result = await databaseObj.findUserByUsername(data.username)
    if (result) {
      res.send({ code: 1001, data: { message: "用户名已存在" } })
    } else {
      const uid = generateUid()
      data.uid = uid
      await databaseObj.addUser(data)
      res.send({ code: 1000, data: { message: "注册成功" } })
    }
  } catch (error) {
    console.error('注册接口报错: ', error);
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/register", register)

// 用户登录接口
async function login(req, res) {
  const { username, password } = req.body
  try {
    const result = await databaseObj.findUserByUsername(username)
    if (result) {
      if (password === result.password) {
        const token = createToken(result.uid);
        res.send({ code: 1000, data: { message: "登陆成功", token } })
      } else {
        res.send({ code: 1001, data: { message: "账号或密码错误" } })
      }
    } else {
      res.send({ code: 1001, data: { message: "用户不存在" } })
    }
  } catch (error) {
    console.error('登录接口报错: ', error);
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.post("/login", login)

// 用户信息查询接口
async function getUserMessage(req, res) {
  const uid = req.uid
  try {
    const result = await databaseObj.findUserByUid(uid)
    if (result) {
      res.send({ code: 1000, data: { message: "查询成功", userinfo: result } })
    } else {
      res.send({ code: 1002, data: { message: "用户不存在" } })
    }
  } catch (error) {
    console.error('用户信息查询接口报错: ', error);
    res.send({ code: 1003, data: { message: "服务繁忙" } })
  }
}
router.get("/getUserMessage", jwtVerify, getUserMessage)

// 用户注销接口
async function deleteUser(req, res) {
  const { uid } = req.query;
  try {
    const result = await databaseObj.deleteUser(uid);
    if (result === 1) {
      res.send({ code: 1000, data: { message: "注销成功" } });
    } else {
      res.send({ code: 1001, data: { message: "注销失败" } });
    }
  } catch (error) {
    console.error("删除接口报错:", error);
    res.send({ code: 1003, data: { message: "服务繁忙，请稍后重试" } });
  }
}
router.get("/deleteUser", jwtVerify, deleteUser);

// 用户修改密码接口
async function modifyPassword(req, res) {
  const uid = req.uid;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await databaseObj.findUserByUid(uid);
    if (user && oldPassword === user.password) {
      await databaseObj.modifyPassword(uid, newPassword);
      res.send({ code: 1000, data: { message: '密码修改成功' } });
    } else {
      res.send({ code: 1001, data: { message: '旧密码不正确' } });
    }
  } catch (error) {
    console.error('用户修改密码接口错误：', error);
    res.status(500).send({ code: 1003, data: { message: '服务繁忙' } });
  }
}
router.post("/modifyPassword", jwtVerify, modifyPassword);

// 用户修改信息接口
async function modifyUserMessage(req, res) {
  const uid = req.uid;
  const data = req.body;
  const file = req.file;
  try {
    if (file) {
      // 生成新的文件名，例如使用用户的 UID
      const newFileName = `${uid}.jpg`;

      // 构建新的文件路径
      const newPath = path.join(__dirname, '../public/avatar', newFileName);

      // 重命名文件
      fs.renameSync(file.path, newPath);

      data.avatar = `/avatar/${newFileName}`;
    }

    await databaseObj.modifyUserMessage(uid, data);
    res.send({ code: 1000, data: { message: '用户信息修改成功' } });
  } catch (error) {
    console.error('用户修改信息接口错误：', error);
    res.status(500).send({ code: 1003, data: { message: '服务繁忙' } });
  }
}

router.post("/modifyUserMessage", jwtVerify, upload.single('avatar'), modifyUserMessage)

// 获取所有用户信息接口
async function getAllUser(req, res) {
  try {
    const users = await databaseObj.getAllUsers()
    res.send({ code: 1000, data: { message: '查询成功', users } })
  } catch (error) {
    console.error('获取所有用户信息接口错误：', error);
    res.status(500).send({ code: 1003, data: { message: '服务繁忙' } });
  }
}
router.get("/getAllUser", jwtVerify, getAllUser)

// 用户信息查询接口（根据用户名）
async function getUserMessageByUsername(req, res) {
  const { username } = req.query; // 从查询参数中获取用户名
  console.log('username: ', username);
  try {
    const result = await databaseObj.findUsersByUsernameSimilar(username); // 使用新的数据库方法来查询用户信息
    if (result.length > 0) {
      res.send({ code: 1000, data: { message: "查询成功", users: result } }); // 返回查询到的用户信息数组
    } else {
      res.send({ code: 1001, data: { message: "用户不存在" } });
    }
  } catch (error) {
    console.error('用户信息查询接口报错: ', error);
    res.send({ code: 1003, data: { message: "服务繁忙" } });
  }
}
router.get("/getUserMessageByUsername", jwtVerify, getUserMessageByUsername); // 更新路由路径和处理函数名称


// 导出用户路由
module.exports = router