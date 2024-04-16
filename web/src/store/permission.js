import { defineStore } from "pinia"
import { dynamicRoutes } from "@/router"

export const usePermissionStore = defineStore("permissionStore", () => {

  const generateRoutes = role => {
    if (role && role === 1) {
      return dynamicRoutes
    } else {
      return []
    }
  }

  return {
    generateRoutes
  }
})