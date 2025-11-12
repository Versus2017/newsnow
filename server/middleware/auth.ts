import process from "node:process"

export default defineEventHandler(async (event) => {
  // 设置为无需用户登录
  event.context.disabledLogin = true

  // 但为了API请求添加服务器级别的认证上下文
  if (["JWT_SECRET", "G_CLIENT_ID", "G_CLIENT_SECRET"].every(k => process.env[k])) {
    // 如果提供了所有凭证，则设置服务器具有API访问能力
    event.context.serverHasApiAccess = true

    // 创建一个虚拟服务器用户上下文，用于API认证
    event.context.serverUser = {
      id: "server",
      type: "server",
    }
  } else {
    event.context.serverHasApiAccess = false
  }
})
