import NProgress from 'nprogress'
import router from "@/router"
import { useUserStore } from '@/store/userStore'
import { useCartStore } from '@/store/cartStore'
import { usePermissionStore } from '@/store/permission'
import { ElMessage } from 'element-plus'
import { useAddressStore } from './store/addressStore'

NProgress.configure({ showSpinner: false }) // 配置进度条

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  if (userStore.token) {
    if (to.path === "/login") {
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasUserRole = userStore.userinfo.isAdmin === 0 || userStore.userinfo.isAdmin === 1
      if (hasUserRole) {
        const cartStore = useCartStore()
        const { carts } = cartStore
        if (!carts.value) {
          cartStore.getUserCarts()
        }
        const addressStore = useAddressStore()
        const { addresses } = addressStore
        if (!addresses.value) {
          addressStore.findAddress()
        }
        next()
      } else {
        try {
          await userStore.getUserInfo()
          const { isAdmin } = userStore.userinfo
          const accessRoutes = await permissionStore.generateRoutes(isAdmin)
          accessRoutes.forEach(item => {
            router.addRoute(item)
          })
          const cartStore = useCartStore()
          const { carts } = cartStore
          if (!carts.value) {
            cartStore.getUserCarts()
          }
          const addressStore = useAddressStore()
          const { addresses } = addressStore
          if (!addresses.value) {
            addressStore.findAddress()
          }
          next({ ...to, replace: true });
        } catch (error) {
          console.log('路由守卫报错: ', error)
          await userStore.resetToken()
          ElMessage.error(error || 'router Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    console.log("no have token")
    if (to.path !== "/login" && to.path !== "/register") {
      next(`/login?redirect=${to.path}`)
    } else {
      next()
    }
    NProgress.done();
  }
})

router.afterEach(() => {
  NProgress.done()
})
