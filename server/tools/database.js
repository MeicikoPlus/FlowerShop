const mysql = require("mysql")

class DataBase {
  constructor(limit, timeout) {
    this.connection = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "root",
      database: "flower_shop",
      connectionLimit: limit,
      connectTimeout: timeout,
    })
    // 连接成功处理程序
    this.connection.on("connection", () => {
      console.log("Database connection successful")
    })
    // 连接失败处理程序
    this.connection.on("error", err => {
      console.error("Database connection error:", err)
    })
  }

  // 用户表操作
  // 添加用户
  addUser(data) {
    return new Promise((resolve, reject) => {
      const { username, password, uid } = data
      const query = `INSERT INTO users (username, password, uid) VALUES (?, ?, ?)`
      this.connection.query(
        query,
        [username, password, uid],
        (error, results) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
        }
      )
    })
  }

  // 根据用户名相似查询用户
  findUsersByUsernameSimilar(username) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE username LIKE ?`
      const searchPattern = `%${username}%` // 在用户名两侧添加通配符 %
      this.connection.query(query, [searchPattern], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results) // 返回结果数组
        }
      })
    })
  }



  // 获取所有用户信息
  getAllUsers() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users`
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 注销用户
  deleteUser(uid) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM users WHERE uid = ?`
      this.connection.query(query, [uid], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results.affectedRows)
        }
      })
    })
  }

  // 根据用户名寻找用户
  findUserByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE username = ?`
      this.connection.query(query, [username], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results[0])
        }
      })
    })
  }

  // 根据用户 uid 来寻找用户
  findUserByUid(uid) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE uid = ?`
      this.connection.query(query, [uid], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results[0])
        }
      })
    })
  }

  // 修改密码
  modifyPassword(uid, newPassword) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET password = ? WHERE uid = ?`
      this.connection.query(query, [newPassword, uid], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 修改用户信息
  modifyUserMessage(uid, updatedData) {
    return new Promise((resolve, reject) => {
      // 构建更新语句
      const updateFields = Object.keys(updatedData)
      const updateValues = updateFields.map(field => `${field} = ?`).join(", ")

      const query = `UPDATE users SET ${updateValues} WHERE uid = ?`

      // 将 uid 加入更新值数组
      const updateData = [...Object.values(updatedData), uid]

      this.connection.query(query, updateData, (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 地址表操作
  // 添加一个地址
  addAddress(data) {
    return new Promise((resolve, reject) => {
      const { id, uid, simple_address, detailed_address } = data
      const query = `INSERT INTO addresses (id, uid, simple_address, detailed_address) VALUES (?, ?, ?, ?)`
      this.connection.query(
        query,
        [id, uid, simple_address, detailed_address],
        (error, results) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
        }
      )
    })
  }

  // 删除已有地址(单个删除)
  deleteAddress(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM addresses WHERE id = ?`
      this.connection.query(query, [id], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results.affectedRows)
        }
      })
    })
  }

  // 查找某个用户下的所有地址
  findAddresses(uid) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM addresses WHERE uid = ?`
      this.connection.query(query, [uid], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 修改已有地址
  modifyAddress(data) {
    return new Promise((resolve, reject) => {
      const { id, simple_address, detailed_address } = data
      const query = `UPDATE addresses SET simple_address = ?, detailed_address = ? WHERE id = ?`
      this.connection.query(
        query,
        [simple_address, detailed_address, id],
        (error, results) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
        }
      )
    })
  }

  // 商品表操作
  // 根据id查询商品信息
  findProductById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM products WHERE id = ?`
      this.connection.query(query, [id], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results[0])
        }
      })
    })
  }

  // 随机查询指定条商品数据
  findProductRandom(num) {
    return new Promise((resolve, reject) => {
      num = parseInt(num)
      const query = `SELECT * FROM products ORDER BY RAND() LIMIT ?`
      this.connection.query(query, [num], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 根据商品分类来查询某个分类的所有商品
  findProductByCategory(category) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM products WHERE product_category = ?`
      this.connection.query(query, [category], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 查询商品所有的分类
  findProductCategory() {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT product_category FROM products`
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error)
        } else {
          const categories = results.map(result => result.product_category)
          resolve(categories)
        }
      })
    })
  }

  // 根据关键词查询
  findProductByKeyword(keyword) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM products WHERE product_name LIKE ?`
      const searchKeyword = `%${keyword}%`

      this.connection.query(query, [searchKeyword], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 增加某个商品存货
  increaseProductionNumber(id, num) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE products SET product_number = product_number + ? WHERE id = ?`
      this.connection.query(query, [num, id], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 减少某个商品存货
  decreaseProductInventory(id, num) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE products SET product_number = ? WHERE id = ?`
      this.connection.query(query, [num, id], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 删除某个商品
  deleteProduct(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM products WHERE id = ?`
      this.connection.query(query, [id], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 分页查询所有商品
  paginateAllProducts(page, pageSize) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * pageSize;
      const query = `SELECT * FROM products ORDER BY id LIMIT ?, ?`;
      this.connection.query(query, [offset, pageSize], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  // 获取商品总数
  getTotalProductCount() {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS totalCount FROM products`;
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0].totalCount);
        }
      });
    });
  }
  

  // 添加商品的方法
  addProduct(data) {
    const sql = `INSERT INTO products (product_name, product_category, product_image, product_description, product_price, product_number, product_discount) VALUES (?, ?, ?, ?, ?, ?, ?)`
    return new Promise((resolve, reject) => {
      this.connection.query(sql, [data.product_name, data.product_category, data.product_image, data.product_description, data.product_price, data.product_number, data.product_discount], (err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }
  // 购物车表操作
  // 添加购物车，如果存在相同 product_id，则更新数量；否则插入新记录
  addCart(data) {
    return new Promise((resolve, reject) => {
      const { uid, product_id, quantity, product_name, product_image, price } =
        data
      const queryFindProduct = `SELECT id, quantity FROM cart WHERE uid = ? AND product_id = ?`
      this.connection.query(
        queryFindProduct,
        [uid, product_id],
        (error, results) => {
          if (error) {
            reject(error)
          } else {
            if (results.length > 0) {
              const updatedQuantity = quantity
              const cartItemId = results[0].id
              const queryUpdateQuantity = `UPDATE cart SET quantity = ? WHERE id = ?`
              this.connection.query(
                queryUpdateQuantity,
                [updatedQuantity, cartItemId],
                (updateError, updateResults) => {
                  if (updateError) {
                    reject(updateError)
                  } else {
                    resolve(updateResults)
                  }
                }
              )
            } else {
              // 商品不存在于购物车中，插入新记录
              const queryInsertProduct = `
              INSERT INTO cart (uid, product_id, quantity, price, product_image, product_name)
              VALUES (?, ?, ?, ?, ?, ?)
            `
              this.connection.query(
                queryInsertProduct,
                [uid, product_id, quantity, price, product_image, product_name],
                (insertError, insertResults) => {
                  if (insertError) {
                    reject(insertError)
                  } else {
                    resolve(insertResults)
                  }
                }
              )
            }
          }
        }
      )
    })
  }

  // 根据[id]删除购物车某条/某几条数据(数组中可以有一个或者多个id)（之后的清空购物车也是多次调用这个函数来执行的）
  deleteCartById(ids) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM cart WHERE id IN (?)`
      this.connection.query(query, [ids], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results.affectedRows)
        }
      })
    })
  }

  // 根据用户的uid来查询该用户的购物车
  findCartsByUid(uid) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM cart WHERE uid = ?`
      this.connection.query(query, [uid], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 根据id来更新某个购物车内部的某个商品的数据（主要是更新某商品购买的数量）
  updateCart(data) {
    const { id, quantity } = data
    return new Promise((resolve, reject) => {
      const query = `UPDATE cart SET quantity = ? WHERE id = ?`
      this.connection.query(query, [quantity, id], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 轮播图表操作
  // 查询轮播图信息
  getSlideShowMsg() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM slideshow`
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 订单表操作
  // 生成订单
  addOrder(data) {
    const { id, message, time, state, uid } = data
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO orders (id, message, time, state, uid) VALUES (?, ?, ?, ?, ?)`
      this.connection.query(
        query,
        [id, message, time, state, uid],
        (error, results) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
        }
      )
    })
  }

  // 更改订单状态
  updateOrderState(id, state) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE orders SET state = ? WHERE id = ?`
      this.connection.query(query, [state, id], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 删除订单
  deleteOrder(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM orders WHERE id = ?`
      this.connection.query(query, [id], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results.affectedRows)
        }
      })
    })
  }

  // 查询某个用户下的所有订单
  findOrdersByUid(uid) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM orders WHERE uid = ?`
      this.connection.query(query, [uid], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 根据id查询某个订单
  findOrderById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM orders WHERE id = ?`
      this.connection.query(query, [id], (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  // 查询所有订单
  findAllOrder() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM orders`
      this.connection.query(query, (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }
}

const databaseObj = new DataBase(100, 10000)
module.exports = databaseObj
