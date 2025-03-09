import process from "node:process"

export default defineEventHandler(async (event) => {
  return {
    statusCode: 403,
    message: "登录功能已被禁用"
  }
})
