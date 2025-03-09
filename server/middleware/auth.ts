import process from "node:process"

export default defineEventHandler(async (event) => {
  // 始终设置为禁用登录模式
  event.context.disabledLogin = true
})
