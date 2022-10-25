export default function wxRequest(config) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      success(res) {
        const { resolveWrap, rejectWrap } = config
        if (!res.data.success) {
          // 请求成功，但是 处理逻辑失败
          return reject(rejectWrap ? rejectWrap(res) : res)
        }
        // 请求成功 直接 过滤 需要的数据使用
        const data = resolveWrap ? resolveWrap(res.data) : res.data
        resolve(data)
      },
      fail(res) {
        const { rejectWrap } = config
        reject(rejectWrap ? rejectWrap(res) : res)
      }
    })
  })
}
