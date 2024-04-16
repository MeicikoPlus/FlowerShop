import request from "@/utils/request";

// 查询轮播图
export function getSlideShowMsgApi() {
  return request({
    url: "/tool/getSlideShowMsg",
    method: "GET"
  })
}