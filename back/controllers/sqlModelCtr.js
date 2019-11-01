var modelDb = require('../models/sqlModel')
var midWares = require('./middleware')

exports.sqlResolve = (req,res,next) =>{
  var str = ''
  req.on("data",function(chunk){  str+=chunk  })
  req.on("end",function(){
      var paramObj = JSON.parse(str)
      let reqParams = req.body;
      let mid = paramObj.id;
      var finaRes = res
      console.log(mid, 'aaa')
      if (mid) {
        modelDb.excuModel(mid, function(err, res, field) {
          modelDb.resolveSql(req, res[0], function(sqlres){
            // console.log(res[0])
            try {
              if (res[0].mid_ware && res[0].mid_ware !== '') {
                var mids = JSON.parse(res[0].mid_ware)
                for (var k in mids) {
                  if (mids[k] && midWares[mids[k]]) {
                    var midFun = midWares[mids[k]]
                    sqlres[k] = midFun(sqlres[k])
                  }
                }
              }
            } catch(err) {
              console.log(err)
            }
            // 中间件处理
            console.log(123)
            finaRes.json(sqlres)
          })
        })
      }
  })
  
  // console.log(aid)
}