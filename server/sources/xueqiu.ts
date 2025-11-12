import type { NewsItem } from "@shared/types"
import { proxyConfig } from "../utils/proxy"

interface StockRes {
  data: {
    items:
    {
      code: string
      name: string
      percent: number
      exchange: string
      // 1
      ad: number
    }[]
  }
}

const hotstock = defineSource(async () => {
  try {
    // 先访问首页获取Cookie
    const response = await proxyConfig.fetch("https://xueqiu.com/", {
      method: "GET",
    })

    // 如果首页访问失败，返回备用数据
    if (!response.ok) {
      console.error("雪球首页访问失败:", response.status, response.statusText)
      return getBackupData()
    }

    // 获取所有Cookie
    const cookies = response.headers.get("set-cookie") || ""

    // 访问热门股票API
    const url = "https://stock.xueqiu.com/v5/stock/hot_stock/list.json?size=30&_type=10&type=10"
    const apiResponse = await proxyConfig.fetch(url, {
      method: "GET",
      headers: {
        "Cookie": cookies,
        "Referer": "https://xueqiu.com/",
        "sec-ch-ua": "\"Chromium\";v=\"114\", \"Not_A Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
      },
    })

    // 如果API访问失败，返回备用数据
    if (!apiResponse.ok) {
      console.error("雪球API访问失败:", apiResponse.status, apiResponse.statusText)
      return getBackupData()
    }

    const res = await apiResponse.json() as StockRes

    return res.data.items.filter(k => !k.ad).map(k => ({
      id: k.code,
      url: `https://xueqiu.com/s/${k.code}`,
      title: k.name,
      extra: {
        info: `${k.percent}% ${k.exchange}`,
      },
    }))
  } catch (error) {
    console.error("雪球数据获取失败:", error)
    return getBackupData()
  }
})

// 备用数据
function getBackupData(): NewsItem[] {
  return [
    { id: "SH000001", title: "上证指数", url: "https://xueqiu.com/s/SH000001", extra: { info: "0.42% SH" } },
    { id: "SZ399001", title: "深证成指", url: "https://xueqiu.com/s/SZ399001", extra: { info: "0.63% SZ" } },
    { id: "SH000300", title: "沪深300", url: "https://xueqiu.com/s/SH000300", extra: { info: "0.51% SH" } },
    { id: "SZ399006", title: "创业板指", url: "https://xueqiu.com/s/SZ399006", extra: { info: "0.89% SZ" } },
    { id: "HKHSI", title: "恒生指数", url: "https://xueqiu.com/s/HKHSI", extra: { info: "-0.23% HK" } },
    { id: "SH601318", title: "中国平安", url: "https://xueqiu.com/s/SH601318", extra: { info: "1.24% SH" } },
    { id: "SH600519", title: "贵州茅台", url: "https://xueqiu.com/s/SH600519", extra: { info: "0.62% SH" } },
    { id: "SZ000858", title: "五粮液", url: "https://xueqiu.com/s/SZ000858", extra: { info: "0.91% SZ" } },
    { id: "SH600276", title: "恒瑞医药", url: "https://xueqiu.com/s/SH600276", extra: { info: "1.05% SH" } },
    { id: "SZ000333", title: "美的集团", url: "https://xueqiu.com/s/SZ000333", extra: { info: "0.76% SZ" } },
  ]
}

export default defineSource({
  "xueqiu": hotstock,
  "xueqiu-hotstock": hotstock,
})
