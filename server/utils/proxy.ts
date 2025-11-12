import process from "node:process"
import { HttpsProxyAgent } from "https-proxy-agent"
import { fetch as nodeFetch } from "ofetch"

// 统一的代理配置
export const proxyConfig = {
  // 从环境变量获取代理URL，默认本地7890端口
  url: process.env.HTTP_PROXY || process.env.HTTPS_PROXY || "http://127.0.0.1:7890",

  // 基础请求头，模拟浏览器
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": "https://www.google.com/",
    "Cache-Control": "no-cache",
  },

  // 获取代理Agent
  getAgent() {
    if (!this.url) return undefined
    try {
      return new HttpsProxyAgent(this.url)
    } catch (error) {
      console.error("创建代理Agent失败:", error)
      return undefined
    }
  },

  // 使用代理发起请求
  async fetch(url: string, options: RequestInit = {}) {
    try {
      const agent = this.getAgent()
      const response = await nodeFetch(url, {
        ...options,
        headers: { ...this.headers, ...options.headers },
        // @ts-expect-error - ofetch may not recognize agent option
        agent,
      })
      return response
    } catch (error) {
      console.error(`代理请求失败: ${url}`, error)
      throw error
    }
  },
}

// 图片代理（保留原有功能）
export function proxyPicture(url: string, type: "encodeURIComponent" | "encodeBase64URL" = "encodeURIComponent") {
  const encoded = type === "encodeURIComponent" ? encodeURIComponent(url) : btoa(url).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  return `/api/proxy/img.png?type=${type}&url=${encoded}`
}
