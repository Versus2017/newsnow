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
  // 先访问首页获取需要的Cookie
  const response = await $fetch.raw("https://xueqiu.com/", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Connection": "keep-alive",
    },
  })
  
  // 提取所有Cookie
  const setCookieHeader = response.headers.get('set-cookie') || response.headers.get('Set-Cookie') || []
  const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]
  
  // 提取cookie值部分
  const cookieStr = cookieArray.map(cookie => cookie.split(';')[0]).join('; ')
  
  // 访问热门股票API
  const url = "https://stock.xueqiu.com/v5/stock/hot_stock/list.json?size=30&_type=10&type=10"
  const res: StockRes = await myFetch(url, {
    headers: {
      "Cookie": cookieStr,
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      "Referer": "https://xueqiu.com/",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Origin": "https://xueqiu.com",
      "Connection": "keep-alive",
    },
  })
  
  return res.data.items.filter(k => !k.ad).map(k => ({
    id: k.code,
    url: `https://xueqiu.com/s/${k.code}`,
    title: k.name,
    extra: {
      info: `${k.percent}% ${k.exchange}`,
    },
  }))
})

export default defineSource({
  "xueqiu": hotstock,
  "xueqiu-hotstock": hotstock,
})
