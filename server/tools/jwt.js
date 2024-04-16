const jwt = require('jsonwebtoken'); // 导入token模块

const secretKey = 'flower' // 设置生成token的专属秘钥
/**
 * 
 * @param {''} uid string 接收用户的uuid
 * @param {*} time 设置toke的持续事件,默认为10天
 * @returns 
 */
const createToken = (uid, time = '10d') => {
  const token = jwt.sign({ uid }, secretKey, { expiresIn: time });
  return token
}

/**
 * 验证token的中间函数,用来配合接口来检测token是否有误
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const jwtVerify = (req, res, next) => {
  const token = req.header("Authorization")
  
  if (!token) {
    return res.status(401).json({ message: "未经授权" })
  }

  // 校验
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey)
    req.uid = decoded.uid
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'token已过期' });
    } else {
      return res.status(401).json({ message: '无效的token' });
    }
  }
}

module.exports = {
  createToken,
  jwtVerify
}
