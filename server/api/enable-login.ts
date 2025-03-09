import process from "node:process"

export default defineEventHandler(async () => {
  return {
    enable: false,
    message: "登录功能已被禁用"
  }
})
