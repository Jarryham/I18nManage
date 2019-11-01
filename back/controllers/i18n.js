var i18nDb = require('../models/i18n')

// 获取客户端ip
var get_client_ip = function(req) {
  var ip = req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
  if(ip.split(',').length>0){
      ip = ip.split(',')[0]
  }
  return ip;
};
exports.save = (req,res,next) =>{
  var str = ''
  var ip = get_client_ip(req)
  req.on("data",function(chunk){  str+=chunk  })
  req.on("end",function(){
      var paramObj = JSON.parse(str)
      var historySave = null
      // console.log(paramObj, 'mid')
      if (paramObj.id && paramObj.id !== '') {
        i18nDb.qureyItem(paramObj.id, function(err, queryRes) {
          if (err) next(err);
          historySave = queryRes
          // 开始修改
          console.log(req.session, 'ssssss')
          i18nDb.EditI18nItem(paramObj, function(err, result) {
            if(err) next(err);
            // 修改成功  写入记录
            console.log(req.cookies)
            // console.log(req, 'req')
            // console.log(result)
          })
        })
        
      }
      
      res.send({status: 'ok'})
  })
  
  // console.log(aid)
}

exports.qureyI18n = (req, res, next) => {
  var str = ''
  req.on("data",function(chunk){  str+=chunk  })
  req.on("end", function() {
    console.log(req.session, 'ssssss')
    if(str !== '') {
      var paramObj = JSON.parse(str)
      if (paramObj.id) {
        i18nDb.qureyItem(paramObj.id, function(err, queryRes){
          if (err) next(err);
          res.send({
            status: 'ok',
            data: queryRes
          })
        })
      } else {
        i18nDb.qureyAll(function(err, qurey) {
          if(err) next(err);
          res.send({
            status: 'ok',
            data: qurey
          })
        })
      }
    } else {
      i18nDb.qureyAll(function(err, qurey) {
        if(err) next(err);
        res.send({
          status: 'ok',
          data: qurey
        })
      })
    }
    
  })
}