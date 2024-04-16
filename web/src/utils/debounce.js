/**
 * 
 * @param {function} fn 需要防抖的函数
 * @param {number} wait 需要等待的时间
 */
export function myDebounce(fn, wait) {
  let timer = null
  const _debounce = function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, wait)
  }
  return _debounce
}
