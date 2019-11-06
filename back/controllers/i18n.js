var i18nDb = require('../models/i18n')
var dbData = require('../config/db')

//
const dbmsg = {
  host: dbData.configPool.config.connectionConfig.host,
  port: dbData.configPool.config.connectionConfig.port,
  database: dbData.configPool.config.connectionConfig.database
}
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
          historySave = JSON.stringify(queryRes[0])
          // 开始修改
          i18nDb.EditI18nItem(paramObj, function(err, result) {
            if(err) next(err);
            // 修改成功  写入记录
            const time = new Date().getTime()
            i18nDb.addLog({
              time: parseInt(time/1000),
              history: historySave,
              current: str,
              userId: 1,
              ip: ip, 
              type: 'edit', 
              database: `${dbmsg.host}:${dbmsg.port}/${dbmsg.database}`,
              target_id: paramObj.id
            }, function(err2, editRes) {
              
            })
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

exports.db = function(req, res) {
  console.log(dbData.configPool.config.connectionConfig)
  res.json({
    status: 'ok',
    data: {
     host: dbData.configPool.config.connectionConfig.host,
     port: dbData.configPool.config.connectionConfig.port,
     database: dbData.configPool.config.connectionConfig.database
    }
  })
}