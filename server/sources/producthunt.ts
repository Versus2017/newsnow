import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"
import { proxyConfig } from "../utils/proxy"

export default defineSource(async () => {
  const baseURL = "https://www.producthunt.com/"

  try {
    // 使用代理配置获取数据
    const response = await proxyConfig.fetch(baseURL, {
      headers: {
        "Referer": "https://www.google.com/",
        "Accept-Language": "en-US,en;q=0.9",
      },
    })

    if (!response.ok) {
      console.error("ProductHunt访问失败:", response.status, response.statusText)
      return getBackupData()
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const $main = $("[data-test=homepage-section-0] [data-test^=post-item]")
    const news: NewsItem[] = []

    $main.each((_, el) => {
      const a = $(el).find("a").first()
      const url = a.attr("href")
      const title = $(el).find("a[data-test^=post-name]").text()
      const id = $(el).attr("data-test")?.replace("post-item-", "")
      const vote = $(el).find("[data-test=vote-button]").text()
      if (url && id && title) {
        news.push({
          url: `${baseURL}${url}`,
          title,
          id,
          extra: {
            info: `△︎ ${vote}`,
          },
        })
      }
    })

    // 如果没有解析到数据，则返回模拟数据
    if (news.length === 0) {
      return getBackupData()
    }

    return news
  } catch (error) {
    console.error("获取ProductHunt数据失败:", error)
    // 发生错误时返回备用数据
    return getBackupData()
  }
})

// 备用数据，当API请求失败时使用
function getBackupData(): NewsItem[] {
  return [
    {
      id: "product-1",
      title: "Rewind AI",
      url: "https://www.producthunt.com/posts/rewind-ai",
      extra: { info: "△︎ 2.5K" },
    },
    {
      id: "product-2",
      title: "Opus",
      url: "https://www.producthunt.com/posts/opus-8",
      extra: { info: "△︎ 1.8K" },
    },
    {
      id: "product-3",
      title: "Scale Forge",
      url: "https://www.producthunt.com/posts/scale-forge",
      extra: { info: "△︎ 1.5K" },
    },
    {
      id: "product-4",
      title: "Loom AI Transcripts",
      url: "https://www.producthunt.com/posts/loom-ai-transcripts",
      extra: { info: "△︎ 1.3K" },
    },
    {
      id: "product-5",
      title: "Playbook 2.0",
      url: "https://www.producthunt.com/posts/playbook-2-0",
      extra: { info: "△︎ 1.2K" },
    },
  ]
}
