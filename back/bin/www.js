const app = require('../app')
const config = require('../config/config')

app.listen(config.port,'0.0.0.0',()=>{
  console.log('服务器启动了')
})
