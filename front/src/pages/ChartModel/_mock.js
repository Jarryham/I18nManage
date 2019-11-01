const lineData = []
const startTime = 1563724800
for (var i = 0; i < 24; i++) {
  if (startTime + 3600 * i !== 1563760800) {
    const obj = {
      time: startTime + 3600 * i,
      inbyte: 2000000000 + parseInt(Math.random() * 2000000000),
      outbyte: 1000000000 + parseInt(Math.random() * 1000000000)
    }
    lineData.push(obj)
  }
}
const getFakeChart = {
  lineData
}
const barData = [
  { flow: 10568485, name: '奥飞' },
  { flow: 10568485, name: '深圳联通' },
  { flow: 205684850, name: '互联港湾' },
  { flow: 32344850, name: '奥斯达' },
  { flow: 143484850, name: '广东广电' },
  { flow: 32344850, name: '中国移动' },
  { flow: 143484850, name: '中国联通' },
  { flow: 32344850, name: '中国电信' },
  { flow: 143484850, name: '爱奇艺' },
  { flow: 35564850, name: '腾讯科技' }
]
const getFakeBar = {
  barData
}
const getFakePie = {
  pieData:  [{ inbyte: 10568485, name: '流入流量' }, { outbyte: 15682948, name: '流出流量' }]
}
export default {
  'GET  /api/fake_chart': getFakeChart,
  'GET  /api/fakeBar': getFakeBar,
  'GET  /api/fakePie': getFakePie
};