import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '@/layout'

// 静态路由
export const staticRoutes = [
  // 登录页
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
    hidden: true
  },
  // 注册页
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/register"),
    hidden: true
  },
  // 首页
  {
    path: "/",
    component: layout,
    redirect: "/home",
    hidden: false,
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home"),
        meta: { title: "首页" }
      }
    ]
  },
  // 个人页
  {
    path: "/profile",
    component: layout,
    redirect: "/profile",
    hidden: true,
    children: [
      {
        path: "",
        name: "profile",
        component: () => import("@/views/profile"),
        meta: { title: "我的" }
      }
    ]
  },
  // 商品页
  {
    path: "/product",
    component: layout,
    redirect: "/product",
    hidden: false,
    children: [
      {
        path: "",
        name: "product",
        component: () => import("@/views/product"),
        meta: { title: "商城" }
      }
    ]
  },
  // 搜索页
  {
    path: "/search",
    component: layout,
    redirect: "/search",
    hidden: true,
    children: [
      {
        path: '',
        name: "search",
        component: () => import("@/views/search"),
        meta: { title: "搜索" }
      }
    ]
  },
  // 购物车
  {
    path: "/cart",
    component: layout,
    redirect: "/cart",
    hidden: false,
    children: [
      {
        path: "",
        name: "cart",
        component: () => import("@/views/cart"),
        meta: { title: "购物车" }
      }
    ]
  },
  // 商品详情页
  {
    path: "/detail",
    component: layout,
    redirect: "/detail",
    hidden: true,
    children: [
      {
        path: '',
        name: "detail",
        component: () => import("@/views/detail"),
        meta: { title: "商品详情" }
      }
    ]
  },
  {
    path: "/pay",
    component: layout,
    redirect: "/pay",
    hidden: true,
    children: [
      {
        path: '',
        name: "pay",
        component: () => import("@/views/pay"),
        meta: { title: "支付" }
      }
    ]
  },
  // notfound
  {
    path: "/:catchAll(.*)",
    component: layout,
    hidden: true,
    children: [
      {
        path: "",
        name: "notfound",
        component: () => import("@/views/notfound")
      }
    ]
  },
  {
    path: "/address",
    component: layout,
    hidden: true,
    children: [
      {
        path: "",
        name: "address",
        component: () => import("@/views/address")
      }
    ]
  }
]

export const dynamicRoutes = [
  // 管理页面
  {
    path: "/admin",
    name: "admin",
    redirect: '/admin/productManagement',
    component: () => import("@/views/admin"),
    hidden: true,
    meta: {
      hidden: true
    }
  },
    // 商品管理
    {
      path: "/admin/productManagement",
      component: () => import("@/views/admin"),
      hidden: true,
      meta: {
        hidden: false,
        title: "商品管理"
      },
      children: [
        {
          path: "",
          name: "productManagement",
          component: () => import("@/views/productManagement")
        }
      ]
    },
  // 用户管理
  {
    path: "/admin/userManagement",
    component: () => import("@/views/admin"),
    hidden: true,
    meta: {
      hidden: false,
      title: "用户管理"
    },
    children: [
      {
        path: "",
        name: "userManagement",
        component: () => import("@/views/userManagement")
      }
    ]
  },
  // 订单管理
  {
    path: "/admin/orderManagement",
    component: () => import("@/views/admin"),
    hidden: true,
    meta: {
      hidden: false,
      title: "订单管理"
    },
    children: [
      {
        path: "",
        name: "orderManagement",
        component: () => import("@/views/orderManagement")
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...staticRoutes
  ]
})

export default router