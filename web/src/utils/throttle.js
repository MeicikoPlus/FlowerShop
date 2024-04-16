/**
 * 
 * @param {function} fn 需要节流的函数
 * @param {number} wait 设置节流的时间
 * @returns 
 */
export function myThrottle(fn, wait) {
  let timer = true
  const _throttle = function(...args) {
    if (timer) {
      timer = false
      fn.apply(this, args)
      setTimeout(() => {
        timer = true
      }, wait)
    }
  }
  return _throttle
}