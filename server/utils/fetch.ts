import process from "node:process"
import { $fetch } from "ofetch"

// 获取代理URL，优先使用环境变量
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || "http://127.0.0.1:7890"

// 创建默认请求配置
export const myFetch = $fetch.create({
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Sec-Ch-Ua": "\"Chromium\";v=\"130\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"130\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"macOS\"",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
  },
  timeout: 30000, // 增加超时时间到30秒
  retry: 3,
  retryDelay: 500,
  // 显式设置代理
  proxy: proxyUrl,
  // 重定向处理
  redirect: "follow",
  // 禁用默认credentials
  credentials: "omit",
  // 使用node-fetch实现
  fetch: globalThis.fetch,
})
