const middleware = {}
// 处理pie饼图数据
middleware.dealPieModel4 = function(data) {
  if (!data) return [];
  var pieData = data[0]
  var res = []
  if (pieData) {
    for (var k in pieData) {
      const item = {}
      if (k === 'INF') {
        item.name = '流入流量'
        item.value = pieData[k]
      } else if (k === 'OUTF') {
        item.name = '流出流量'
        item.value = pieData[k]
      }
      res.push(item)
    }
  }
  return res
}
module.exports = middleware;