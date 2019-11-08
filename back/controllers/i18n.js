var i18nDb = require('../models/i18n')
var dbData = require('../config/db')
var async = require('async')
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
// 查询修改
function updateItem(id, i18nItem, ip, users, callback) {
  i18nDb.queryDbsById(id, function(err, queryDb) {
    var thisDb = queryDb[0]
    if (err) {
      callback(err)
      return;
    }
    const dbconfig = {
      host     : thisDb.host,
      user     : thisDb.user,
      password : thisDb.password,
      port     : thisDb.dbPort,
      database : thisDb.database
    }
    if (thisDb) {
      i18nDb.asynQueryItemByKeyWidthDb(dbconfig, i18nItem.key, function(err2, i18nitemRes) {
        if (err2) {callback(err2); return;}
        // 查询到指定数据库的原纪录
        var histroyRes = i18nitemRes[0]
        if (histroyRes) {
          // 开始更新
          i18nDb.asynEditItem(dbconfig, i18nItem, function(errEdit, editRes) {
            // 写入成功后计入记录
            if (errEdit) {
              callback(errEdit)
              return;
            }
            const time = new Date().getTime()
            i18nDb.addLog({
              time: parseInt(time/1000),
              history: JSON.stringify(histroyRes),
              current: JSON.stringify(i18nItem),
              userId: users.id,
              ip: ip, 
              type: 'edit', 
              database: `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`,
              target_id: i18nItem.id
            }, function(logerr, editRes) {
              if (logerr) {
                callback(logerr)
              } else {
                callback(logerr, 'ok')
              }
            })
          })
        } else {
          // 在指定的数据库上没有找到对应id的词汇
          i18nDb.asynEditItem(dbconfig, i18nItem, function(errEdit, editRes) {
            // 写入成功后计入记录
            if (errEdit) {
              callback(errEdit)
              return;
            }
            const time = new Date().getTime()
            i18nDb.addLog({
              time: parseInt(time/1000),
              history: '',
              current: JSON.stringify(i18nItem),
              userId: users.id,
              ip: ip, 
              type: 'add', 
              database: `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`,
              target_id: editRes ? editRes.insertId : null
            }, function(addlogerr, addRes) {
              if (addlogerr) {
                callback(addlogerr)
              } else {
                callback(addlogerr, 'ok')
              }
              
            })
          }, 1)
        }
      })
    } else {
      // 没有找到对应的数据库
      callback('未找到对应的数据库')
    }
  })
}

// 当前数据库下修改对应的词汇
function editcurrentI18n(req, res, next, ip, users) {
    var paramObj = req
    i18nDb.queryDbsById(paramObj.current, function(err, queryDb){
      var thisDb = queryDb[0]
      const dbconfig = {
        host     : thisDb.host,
        user     : thisDb.user,
        password : thisDb.password,
        port     : thisDb.dbPort,
        database : thisDb.database
      }
      i18nDb.asynQueryItemByIdWidthDb(dbconfig, paramObj.key, function(err2, queryRes) {
        if (err) next(err);
        if (queryRes[0]) {
          // 自身的数据库 所以不用担心找不到id
          var historySave = JSON.stringify(queryRes[0])
          i18nDb.asynEditItem(dbconfig, paramObj, function(listerr, list) {
            const time = new Date().getTime()
            i18nDb.addLog({
              time: parseInt(time/1000),
              history: historySave,
              current: JSON.stringify(req),
              userId: users.id,
              ip: ip, 
              type: 'edit', 
              database: `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`,
              target_id: paramObj.id
            }, function(err2, editRes) {
              if (err2) {
                res.send({
                  status: 'err', msg: '写入日记失败'
                })
              } else {
                res.send({
                  status: 'ok', msg: '修改成功'
                })
              }
            })
          })
        } else {
          i18nDb.asynEditItem(dbconfig, paramObj, function(listerr, list) {
            const time = new Date().getTime()
            if (listerr) next(listerr);
            i18nDb.addLog({
              time: parseInt(time/1000),
              history: '',
              current: JSON.stringify(req),
              userId: users.id,
              ip: ip, 
              type: 'add', 
              database: `${dbconfig.host}:${dbconfig.port}/${dbconfig.database}`,
              target_id: list ? list.insertId : null
            }, function(err2, editRes) {
              console.log(err2)
              if (err2) {
                res.send({
                  status: 'err', msg: '写入日记失败'
                })
              } else {
                res.send({
                  status: 'ok', msg: '修改成功'
                })
              }
            })
          })
        }
      })
      
    })
}

exports.save = (req,res,next) =>{
  var str = ''
  var ip = get_client_ip(req)
  let token = req.header('Authorization');
  var users = null
  if (token && token !== '') {
    users = JSON.parse(token)
  }
  req.on("data",function(chunk){  str+=chunk  })
  req.on("end",function(){
      var paramObj = JSON.parse(str)
      var historySave = null
      // console.log(paramObj, 'mid')
      if (paramObj.db && paramObj.db.length > 0) {
        // 需要同步到另外的数据库
        // 获取id  根据id查询数据库列表信息，建立数据库连接，查询对应的数据字段，存储历史，开始修改，写入记录
        async.each(paramObj.db, function(db, callback) {
          updateItem(db, paramObj, ip, users, function(err, result) {
            if (err) {
              res.send({
                status: 'err', msg: '同步失败'
              })
            } else {
              callback()
            }
          })
        }, function(err) {
            // if any of the file processing produced an error, err would equal that error
            if( err ) {
              // One of the iterations produced an error.
              // All processing will now stop.
              res.send({
                status: 'err', msg: '同步失败'
              })
            } else {
               // 最后一步
              editcurrentI18n(paramObj, res, next, ip, users)
            }
        });

      } else {
        editcurrentI18n(paramObj, res, next, ip, users)
      }     
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
  res.json({
    status: 'ok',
    data: {
     host: dbData.configPool.config.connectionConfig.host,
     port: dbData.configPool.config.connectionConfig.port,
     database: dbData.configPool.config.connectionConfig.database
    }
  })
}

exports.dbList = function(req, res, next) {
  i18nDb.queryDbs(function(err, result) {
    if (err) next(err);
    res.send({
      status: 'ok',
      data: result
    })
  })
}

exports.queryI18nListWithDb = function(req, res, next) {
  var str = ''
  req.on("data",function(chunk){  str+=chunk  })
  req.on('end', function() {
    var paramObj = JSON.parse(str)
    i18nDb.queryDbsById(paramObj.id, function(err, queryDb){
      var thisDb = queryDb[0]
      const dbconfig = {
        host     : thisDb.host,
        user     : thisDb.user,
        password : thisDb.password,
        port     : thisDb.dbPort,
        database : thisDb.database
      }
      i18nDb.asynQueryI18nList(dbconfig, function(listerr, list) {
        res.send({
          status: 'ok',
          data: list
        })
      })
    })
  })
}

// 修改日志输出
exports.logs = function(req, res, next) {
  i18nDb.logsDb(function(err, result) {
    if (err) next(err);
    res.send({
      status: 'ok',
      data: result
    })
  })
}