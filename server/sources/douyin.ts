interface Res {
  data: {
    word_list: {
      sentence_id: string
      word: string
      event_time: string
      hot_value: string
    }[]
  }
}

export default defineSource(async () => {
  const url = "https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1"
  const response = await $fetch.raw("https://www.douyin.com/passport/general/login_guiding_strategy/?aid=6383")
  // 获取Set-Cookie头部，可能有多个值或者是字符串数组
  const setCookieHeader = response.headers.get('set-cookie') || response.headers.get('Set-Cookie') || []
  const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]
  
  const res: Res = await myFetch(url, {
    headers: {
      cookie: cookieArray.join("; "),
    },
  })
  return res.data.word_list.map((k) => {
    return {
      id: k.sentence_id,
      title: k.word,
      url: `https://www.douyin.com/hot/${k.sentence_id}`,
    }
  })
})
