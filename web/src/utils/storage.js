// 存储localStorage
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

// 获取localStorage
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

// 获取localStorage JSON对象
export const getStoreJSON = name => {
  if (!name) return
  const v = window.localStorage.getItem(name)
  if (!v) return
  return JSON.parse(v)
}

// 删除localStorage
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}